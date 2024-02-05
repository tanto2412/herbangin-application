// controllers/receivingController.js
const receivingModel = require('../models/receivingModel')
const productModel = require('../models/productModel')
const logger = require('../../logger')

async function search(req, res) {
  const receivings = await receivingModel.search(req.query)
  res.json(receivings)
}

async function getById(req, res) {
  const receiving = await receivingModel.getById(req.params.id)

  if (!receiving) {
    res.status(404).send('receiving not found')
    return
  }

  res.json(receiving)
}

async function create(req, res) {
  try {
    let createSpec = await buildCreateSpec(req.body)
    if (createSpec.error) {
      res.status(500).send(createSpec.error)
      return
    }

    const receiving = await receivingModel.create(createSpec.result)

    if (!receiving) {
      res.status(500).send('insert failed')
      return
    }

    res.json(receiving)
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

    editSpec.result.id = req.params.id
    const receiving = await receivingModel.edit(editSpec.result)

    if (!receiving) {
      res.status(500).send('edit failed')
      return
    }

    res.json(receiving)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'edit failed')
  }
}

async function remove(req, res) {
  const receiving = await receivingModel.remove(req.params.id)

  if (!receiving) {
    res.status(500).send('delete failed')
    return
  }

  res.json(receiving)
}

async function buildCreateSpec({ tanggal, items }) {
  const itemIds = items.map(({ product_id }) => product_id)

  const products = await productModel.getByIds(itemIds)
  let productMap = new Map()
  for (let product of products) {
    productMap.set(product.id, product)
  }

  let total = 0
  let missingItems = []
  let filledItems = items.map(({ product_id, jumlah_barang }) => {
    let product = productMap.get(product_id)
    if (!product) {
      missingItems.push(product_id)
      return null
    }
    let subtotal = jumlah_barang * product.harga
    total += subtotal
    return {
      product_id,
      jumlah_barang,
      satuan_terkecil: product.satuan_terkecil,
      harga_satuan: product.harga,
      subtotal,
    }
  })

  if (missingItems.length) {
    return {
      error: `missing items: ${missingItems}`,
      result: null,
    }
  }

  return {
    error: null,
    result: {
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
