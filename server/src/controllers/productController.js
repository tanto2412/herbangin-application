// controllers/productController.js
const productModel = require('../models/productModel')
const logger = require('../../logger')

async function search(req, res) {
  const products = await productModel.search(req.query)
  const pagination = {
    result: products,
    pages: await productModel.count(req.query),
  }
  res.json(pagination)
}

async function getById(req, res) {
  const product = await productModel.getById(req.params.id)

  if (!product) {
    res.status(404).send('product not found')
    return
  }

  res.json(product)
}

async function create(req, res) {
  try {
    if (!validateFastMoving(req.body)) {
      res.status(500).send('fast moving needs batas_fast_moving field')
      return
    }

    const products = await productModel.create(req.body)

    if (!products.length) {
      res.status(500).send('insert failed')
      return
    }

    res.json(products[0])
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'insert failed')
  }
}

async function edit(req, res) {
  try {
    if (!validateFastMoving(req.body)) {
      res.status(500).send('fast moving needs batas_fast_moving field')
      return
    }

    const products = await productModel.edit(req.params.id, req.body)

    if (!products.length) {
      res.status(500).send('update failed')
      return
    }

    res.json(products[0])
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'update failed')
  }
}

async function remove(req, res) {
  const products = await productModel.remove(req.params.id)

  if (!products.length) {
    res.status(404).send('product not found')
    return
  }

  res.json(products[0])
}

function validateFastMoving({ jenis_barang, batas_fast_moving }) {
  if (
    jenis_barang === productModel.JenisBarang.FAST_MOVING &&
    !batas_fast_moving
  ) {
    return false
  }

  return true
}

module.exports = {
  search,
  getById,
  create,
  edit,
  remove,
}
