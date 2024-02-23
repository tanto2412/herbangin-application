// controllers/salesController.js
const salesModel = require('../models/salesModel')
const logger = require('../../logger')

async function search(req, res) {
  const sales = await salesModel.search(req.query)
  const pagination = {
    result: sales,
    pages: await salesModel.count(req.query),
  }
  res.json(pagination)
}

async function getById(req, res) {
  const sales = await salesModel.getById(req.params.id)

  if (!sales) {
    res.status(404).send('sales not found')
    return
  }

  res.json(sales)
}

async function create(req, res) {
  try {
    const sales = await salesModel.create(req.body)

    if (!sales.length) {
      res.status(500).send('insert failed')
      return
    }

    res.json(sales[0])
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'insert failed')
  }
}

async function edit(req, res) {
  try {
    const sales = await salesModel.edit(req.params.id, req.body)

    if (!sales.length) {
      res.status(500).send('update failed')
      return
    }

    res.json(sales[0])
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'update failed')
  }
}

async function remove(req, res) {
  const sales = await salesModel.remove(req.params.id)

  if (!sales.length) {
    res.status(404).send('sales not found')
    return
  }

  res.json(sales[0])
}

module.exports = {
  search,
  getById,
  create,
  edit,
  remove,
}
