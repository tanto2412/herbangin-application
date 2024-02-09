// controllers/receivingController.js
const receivingModel = require('../models/receivingModel')
const productModel = require('../models/productModel')
const logger = require('../../logger')

async function search(req, res) {
  const receivings = await receivingModel.search(req.query)
  res.json(receivings)
}

async function getById(req, res) {
  let receiving = await receivingModel.getById(req.params.id)

  if (!receiving) {
    res.status(404).send('receiving not found')
    return
  }

  const receivingItems = await receivingModel.getItemsById(req.params.id)
  receiving.items = receivingItems

  res.json(receiving)
}

async function create(req, res) {
  try {
    let createSpec = await buildCreateSpec(req.params.id, req.body)
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
    let editSpec = await buildCreateSpec(req.params.id, req.body)
    if (editSpec.error) {
      res.status(500).send(editSpec.error)
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

async function buildCreateSpec(id, { tanggal, items }) {
  const itemIds = items.map(({ product_id }) => product_id)

  const products = await productModel.getByIds(itemIds)
  let productMap = new Map()
  for (let product of products) {
    productMap.set(product.id, product)
  }

  const existingReceivingItems = await receivingModel.getItemsById(id)
  let existingReceivingItemMap = new Map()
  for (let existingReceivingItem of existingReceivingItems) {
    existingReceivingItemMap.set(
      existingReceivingItem.product_id,
      existingReceivingItem
    )
  }

  let total = 0
  let missingItems = []
  let missingJumlah = []
  let exceedStok = []
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

    let existingReceivingItem = existingReceivingItemMap.get(product_id)
    if (existingOrderItem) {
      diff = existingReceivingItem.jumlah_barang - jumlah_barang
      if (diff > product.stok_barang) {
        exceedStok.push(product_id)
        return null
      }
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

  if (exceedStok.length) {
    return {
      error: `exceed stock product: ${exceedStok}`,
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
