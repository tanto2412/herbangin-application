// controllers/orderController.js
const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const customerModel = require('../models/customerModel')
const paymentModel = require('../models/paymentModel')
const returModel = require('../models/returModel')
const giroModel = require('../models/giroModel')
const logger = require('../../logger')
const { isAlreadyTutupBuku } = require('../utils/date')

async function search(req, res) {
  const orders = await orderModel.search(req.query)
  const pagination = {
    result: orders,
    pages: await orderModel.count(req.query),
  }
  res.json(pagination)
}

async function getById(req, res) {
  let order = await orderModel.getById(req.params.id)

  if (!order) {
    res.status(404).send('order not found')
    return
  }

  const orderItems = await orderModel.getItemsById(req.params.id)
  const orderItemIds = orderItems.map((item) => item.id)
  const returItems = await returModel.getItemsByOrderItemIds(orderItemIds)
  let returItemMap = new Map()
  for (let returItem of returItems) {
    if (returItemMap.has(returItem.order_item_id)) {
      let jumlah_barang = returItemMap.get(returItem.order_item_id)
      jumlah_barang += returItem.jumlah_barang
      returItemMap.set(returItem.order_item_id, jumlah_barang)
    } else {
      returItemMap.set(returItem.order_item_id, returItem.jumlah_barang)
    }
  }
  order.items = orderItems.map((orderItem) => {
    orderItem.remainingRetur =
      orderItem.jumlah_barang - (returItemMap.get(orderItem.id) | 0)
    return orderItem
  })

  let existingPayments = await paymentModel.search({
    nomor_faktur: req.params.id,
  })
  let existingAmount = order.total
  for (let payment of existingPayments) {
    if (
      payment.jenis_pembayaran != paymentModel.JenisPembayaran.GIRO ||
      payment.status_pembayaran != giroModel.StatusPembayaran.DITOLAK
    ) {
      existingAmount -= payment.jumlah_pembayaran
    }
  }

  let existingRetur = await returModel.search({ nomor_faktur: req.params.id })
  for (let retur of existingRetur) {
    existingAmount -= retur.total
  }
  order.remainingAmount = existingAmount

  res.json(order)
}

async function create(req, res) {
  try {
    const user = await req.user
    if (isAlreadyTutupBuku(req.body.tanggal_faktur) && !user.administrator) {
      res.status(500).send('tanggal maksimal bulan lalu')
      return
    }

    let createSpec = await buildCreateSpec(req.params.id, req.body)
    if (createSpec.error) {
      res.status(500).send(createSpec.error)
      return
    }

    const order = await orderModel.create(createSpec.result)
    if (!order) {
      res.status(500).send('insert failed')
      return
    }

    res.json(order)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'insert failed')
  }
}

async function edit(req, res) {
  try {
    const user = await req.user
    if (isAlreadyTutupBuku(req.body.tanggal_faktur) && !user.administrator) {
      res.status(500).send('tanggal maksimal bulan lalu')
      return
    }

    let editSpec = await buildCreateSpec(req.params.id, req.body)
    if (editSpec.error) {
      res.status(500).send(editSpec.error)
      return
    }

    editSpec.result.nomor_faktur = req.params.id
    const order = await orderModel.edit(editSpec.result)

    if (!order) {
      res.status(500).send('edit failed')
      return
    }

    res.json(order)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'edit failed')
  }
}

async function remove(req, res) {
  try {
    const order = await orderModel.remove(req.params.id)

    if (!order) {
      res.status(500).send('delete failed')
      return
    }

    res.json(order)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'delete failed')
  }
}

async function buildCreateSpec(
  nomor_faktur,
  { tanggal_faktur, customer_id, items },
) {
  const itemIds = items.map(({ product_id }) => product_id)

  const customer = await customerModel.getById(customer_id)
  if (!customer) {
    return {
      error: `pelanggan tidak ditemukan: ${customer_id}`,
      result: null,
    }
  }

  const products = await productModel.getByIds(itemIds)
  let productMap = new Map()
  for (let product of products) {
    productMap.set(product.id, product)
  }

  const existingOrderItems = await orderModel.getItemsById(nomor_faktur)
  let existingOrderItemMap = new Map()
  for (let existingOrderItem of existingOrderItems) {
    existingOrderItemMap.set(existingOrderItem.product_id, existingOrderItem)
  }

  const otherOrders = await orderModel.search({ customer: customer_id })
  let batasPiutang = Number(customer.batas_piutang)
  let otherOrderIds = []
  for (let otherOrder of otherOrders) {
    if (otherOrder.nomor_faktur != nomor_faktur) {
      batasPiutang -= Number(otherOrder.total)
      otherOrderIds.push(otherOrder.nomor_faktur)
    }
  }

  const payments = await paymentModel.getByOrderIds(otherOrderIds)
  for (let payment of payments) {
    if (
      !payment.status_pembayaran ||
      payment.status_pembayaran === giroModel.StatusPembayaran.LUNAS
    ) {
      batasPiutang += Number(payment.jumlah_pembayaran)
    }
  }

  const returs = await returModel.getByOrderIds(otherOrderIds)
  for (let retur of returs) {
    batasPiutang += Number(retur.total)
  }

  let total = 0
  let missingItems = []
  let missingJumlah = []
  let exceedStok = []
  let filledItems = items.map(({ product_id, jumlah_barang, harga_satuan }) => {
    if (!jumlah_barang) {
      missingJumlah.push(product_id)
      return null
    }

    let product = productMap.get(product_id)
    if (!product) {
      missingItems.push(product_id)
      return null
    }

    let existingOrderItem = existingOrderItemMap.get(product_id)
    let totalBarang = jumlah_barang
    if (existingOrderItem) {
      totalBarang -= existingOrderItem.jumlah_barang
    }
    if (totalBarang > product.stok_barang) {
      exceedStok.push(product_id)
    }

    let subtotal = jumlah_barang * harga_satuan
    total += subtotal
    return {
      product_id,
      kode_barang: product.kode_barang,
      jumlah_barang,
      satuan_terkecil: product.satuan_terkecil,
      harga_satuan: harga_satuan,
      subtotal,
    }
  })

  if (missingJumlah.length) {
    return {
      error: `jumlah barang tidak ditemukan: ${missingJumlah}`,
      result: null,
    }
  }

  if (missingItems.length) {
    return {
      error: `product tidak ditemukan: ${missingItems}`,
      result: null,
    }
  }

  if (exceedStok.length) {
    return {
      error: `produk melebihi stok: ${exceedStok}`,
      result: null,
    }
  }

  if (batasPiutang < total) {
    return {
      error: `penjualan (${total}) melebihi batas piutang pelanggan (${batasPiutang})`,
      result: null,
    }
  }

  return {
    error: null,
    result: {
      tanggal_faktur,
      customer_id,
      sales_id: customer.sales_id,
      total,
      items: filledItems,
    },
  }
}

async function getOutstandingOrder(req, res) {
  const orders = await orderModel.getOutstandingOrder(req.query.customer_id)
  res.json(orders)
}

module.exports = {
  search,
  getById,
  create,
  edit,
  remove,
  getOutstandingOrder,
}
