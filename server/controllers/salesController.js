// controllers/salesController.js
const salesModel = require('../models/salesModel')

async function search(req, res) {
  const sales = await salesModel.search(req.query)
  res.json(sales)
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

    if (!sales) {
      res.status(500).send('insert failed')
      return
    }

    res.json(sales[0])
  } catch (error) {
    res.status(500).send(error.detail ? error.detail : 'insert failed')
  }
}

async function edit(req, res) {
  try {
    const sales = await salesModel.edit(req.params.id, req.body)

    if (!sales) {
      res.status(500).send(error.detail ? error.detail : 'update failed')
      return
    }

    res.json(sales[0])
  } catch (error) {
    console.log(error)
    res.status(500).send(error.detail)
  }
}

async function remove(req, res) {
  const sales = await salesModel.remove(req.params.id)

  if (!sales) {
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
