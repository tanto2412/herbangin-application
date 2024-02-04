// controllers/customerController.js
const customerModel = require('../models/customerModel')

async function search(req, res) {
  const customers = await customerModel.search(req.query)
  res.json(customers)
}

async function getById(req, res) {
  const customer = await customerModel.getById(req.params.id)

  if (!customer) {
    res.status(404).send('customer not found')
    return
  }

  res.json(customer)
}

async function create(req, res) {
  try {
    const customers = await customerModel.create(req.body)

    if (!customers) {
      res.status(500).send('insert failed')
      return
    }

    res.json(customers[0])
  } catch (error) {
    res.status(500).send(error.detail)
  }
}

async function edit(req, res) {
  try {
    const customers = await customerModel.edit(req.params.id, req.body)

    if (!customers) {
      res.status(500).send('update failed')
      return
    }

    res.json(customers[0])
  } catch (error) {
    console.log(error)
    res.status(500).send(error.detail)
  }
}

async function remove(req, res) {
  const customers = await customerModel.remove(req.params.id)

  if (!customers) {
    res.status(404).send('customer not found')
    return
  }

  res.json(customers[0])
}

module.exports = {
  search,
  getById,
  create,
  edit,
  remove,
}
