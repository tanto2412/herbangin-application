// controllers/returController.js
const returModel = require('../models/returModel')
const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const logger = require('../../logger')

async function search(req, res) {
  const returs = await returModel.search(req.query)
  const pagination = {
    result: returs,
    pages: await returModel.count(req.query),
  }
  res.json(pagination)
}

async function getById(req, res) {
  let retur = await returModel.getById(req.params.id)

  if (!retur) {
    res.status(404).send('retur not found')
    return
  }

  const returItems = await returModel.getItemsById(req.params.id)
  retur.items = returItems

  res.json(retur)
}

async function create(req, res) {
  try {
    let createSpec = await buildCreateSpec(req.params.id, req.body)
    if (createSpec.error) {
      res.status(500).send(createSpec.error)
      return
    }

    const retur = await returModel.create(createSpec.result)

    if (!retur) {
      res.status(500).send('insert failed')
      return
    }

    res.json(retur)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'insert failed')
  }
}

async function edit(req, res) {
  try {
    let items = req.body.items
    items = items.map((item) => {
      let updatedItem = item
      updatedItem.retur_id = req.params.id
      return updatedItem
    })
    let editSpec = await buildCreateSpec(req.params.id, req.body)
    if (editSpec.error) {
      res.status(500).send(editSpec.error)
      return
    }

    editSpec.result.id = req.params.id
    const retur = await returModel.edit(editSpec.result)

    if (!retur) {
      res.status(500).send('edit failed')
      return
    }

    res.json(retur)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'edit failed')
  }
}

async function remove(req, res) {
  try {
    const retur = await returModel.remove(req.params.id)

    if (!retur) {
      res.status(500).send('delete failed')
      return
    }

    res.json(retur)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'delete failed')
  }
}

async function buildCreateSpec(retur_id, { nomor_faktur, tanggal, items }) {
  const order = await orderModel.getById(nomor_faktur)
  if (!order) {
    return {
      error: `missing order: ${nomor_faktur}`,
      result: null,
    }
  }

  const orderItemIds = items.map((item) => item.order_item_id)
  const orderItems = await orderModel.getItemsByIds(orderItemIds)
  let orderItemMap = new Map()
  for (let orderItem of orderItems) {
    orderItemMap.set(orderItem.id, orderItem)
  }

  const productIds = orderItems.map((item) => item.product_id)
  const products = await productModel.getByIds(productIds)
  let productMap = new Map()
  for (let product of products) {
    productMap.set(product.id, product)
  }

  const existingReturs = await returModel.search({ nomor_faktur })
  const existingReturIds = existingReturs.map((retur) => retur.id)
  let existingReturItems = await returModel.getItemsByIds(existingReturIds)
  existingReturItems = existingReturItems.filter(
    (item) => item.retur_id != retur_id
  )
  let existingReturItemMap = new Map()
  for (let existingReturItem of existingReturItems) {
    if (existingReturItemMap.has(existingReturItem.product_id)) {
      let jumlah_barang = existingReturItemMap.get(existingReturItem.product_id)
      existingReturItem.jumlah_barang += jumlah_barang
      existingReturItemMap.set(existingReturItem.product_id, existingReturItem)
    } else {
      existingReturItemMap.set(existingReturItem.product_id, existingReturItem)
    }
  }

  let total = 0
  let missingItems = []
  let missingJumlah = []
  let missingOrderItem = []
  let exceedOrderItem = new Map()
  let exceedStok = []
  let filledItems = items.map(({ order_item_id, jumlah_barang }) => {
    if (!jumlah_barang) {
      missingJumlah.push(order_item_id)
      return null
    }

    let orderItem = orderItemMap.get(order_item_id)
    if (!orderItem) {
      missingOrderItem.push(order_item_id)
      return null
    }

    let productId = orderItem.product_id
    const product = productMap.get(productId)

    let existingReturItem = existingReturItemMap.get(productId)
    let totalJumlahBarang =
      (existingReturItem ? existingReturItem.jumlah_barang : 0) + jumlah_barang
    if (orderItem.jumlah_barang < totalJumlahBarang) {
      exceedOrderItem.set(
        order_item_id,
        totalJumlahBarang - orderItem.jumlah_barang
      )
      return null
    }
    if (existingReturItem && existingReturItem.jumlah_barang > jumlah_barang) {
      diff = existingReturItem.jumlah_barang - jumlah_barang
      if (diff > product.stok_barang) {
        exceedStok.push(productId)
      }
    }

    let subtotal = jumlah_barang * orderItem.harga_satuan
    total += subtotal
    return {
      order_item_id,
      product_id: productId,
      kode_barang: orderItem.kode_barang,
      jumlah_barang,
      satuan_terkecil: orderItem.satuan_terkecil,
      harga_satuan: orderItem.harga_satuan,
      subtotal,
    }
  })

  if (missingJumlah.length) {
    return {
      error: `missing jumlah barang: ${missingJumlah}`,
      result: null,
    }
  }

  if (missingOrderItem.length) {
    return {
      error: `missing item penjualan: ${missingOrderItem}`,
      result: null,
    }
  }

  if (missingItems.length) {
    return {
      error: `missing items: ${missingItems}`,
      result: null,
    }
  }

  if (exceedOrderItem.size) {
    return {
      error: `exceed retur available: ${JSON.stringify(
        Array.from(exceedOrderItem)
      )}`,
      result: null,
    }
  }

  if (exceedStok.length) {
    return {
      error: `exceed stock product: ${exceedStok}`,
      result: null,
    }
  }

  return {
    error: null,
    result: {
      customer_id: order.customer_id,
      sales_id: order.sales_id,
      nomor_faktur,
      tanggal,
      total,
      items: filledItems,
    },
  }
}

module.exports = {
  search,
  getById,
  create,
  edit,
  remove,
}
