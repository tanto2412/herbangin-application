// controllers/orderController.js
const orderModel = require('../models/orderModel')
const productModel = require('../models/productModel')
const customerModel = require('../models/customerModel')
const logger = require('../../logger')

async function search(req, res) {
  const orders = await orderModel.search(req.query)
  res.json(orders)
}

async function getById(req, res) {
  const order = await orderModel.getById(req.params.id)

  if (!order) {
    res.status(404).send('order not found')
    return
  }

  res.json(order)
}

async function create(req, res) {
  try {
    let createSpec = await buildCreateSpec(req.body)
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
    let editSpec = await buildCreateSpec(req.body)
    if (editSpec.error) {
      res.status(500).send(createSpec.error)
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
  const order = await orderModel.remove(req.params.id)

  if (!order) {
    res.status(500).send('delete failed')
    return
  }

  res.json(order)
}

async function buildCreateSpec({ tanggal_faktur, customer_id, items }) {
  const itemIds = items.map(({ product_id }) => product_id)

  const customer = await customerModel.getById(customer_id)
  if (!customer) {
    return {
      error: `missing customer: ${customer_id}`,
      result: null,
    }
  }

  const products = await productModel.getByIds(itemIds)
  let productMap = new Map()
  for (let product of products) {
    productMap.set(product.id, product)
  }

  let total = 0
  let missingItems = []
  let missingJumlah = []
  let filledItems = items.map(({ product_id, jumlah_barang }) => {
    if (!jumlah_barang) {
      missingJumlah.push(product_id)
      return null
    }
    let product = productMap.get(product_id)
    if (!product) {
      missingItems.push(product_id)
      return null
    }
    let subtotal = jumlah_barang * product.harga
    total += subtotal
    return {
      product_id,
      kode_barang: product.kode_barang,
      jumlah_barang,
      satuan_terkecil: product.satuan_terkecil,
      harga_satuan: product.harga,
      subtotal,
    }
  })

  if (missingJumlah.length) {
    return {
      error: `missing jumlah barang: ${missingJumlah}`,
      result: null,
    }
  }

  if (missingItems.length) {
    return {
      error: `missing items: ${missingItems}`,
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

module.exports = {
  search,
  getById,
  create,
  edit,
  remove,
}
