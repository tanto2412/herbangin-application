// controllers/customerController.js
const customerModel = require('../models/customerModel')
const salesModel = require('../models/salesModel')
const logger = require('../../logger')

async function search(req, res) {
  const customers = await customerModel.search(req.query)
  const pagination = {
    result: customers,
    pages: await customerModel.count(req.query),
  }
  res.json(pagination)
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
    if (!(await isSalesExists(req.body.sales_id))) {
      res.status(500).send('sales not found')
      return
    }

    const cleanedBody = clean(req.body)

    const customers = await customerModel.create(cleanedBody)

    if (!customers.length) {
      res.status(500).send('insert failed')
      return
    }

    res.json(customers[0])
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'insert failed')
  }
}

async function edit(req, res) {
  try {
    if (!(await isSalesExists(req.body.sales_id))) {
      res.status(500).send('sales not found')
      return
    }

    const cleanedBody = clean(req.body)

    const customers = await customerModel.edit(req.params.id, cleanedBody)

    if (!customers.length) {
      res.status(500).send('update failed')
      return
    }

    res.json(customers[0])
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'update failed')
  }
}

async function remove(req, res) {
  try {
    const customers = await customerModel.remove(req.params.id)

    if (!customers.length) {
      res.status(404).send('customer not found')
      return
    }

    res.json(customers[0])
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'delete failed')
  }
}

async function isSalesExists(sales_id) {
  return await salesModel.getById(sales_id)
}

function clean(body) {
  if (body.email && !body.email.length) body.email = null
  if (body.nomor_handphone && !body.nomor_handphone.length)
    body.nomor_handphone = null
  if (body.nomor_telepon && !body.nomor_telepon.length)
    body.nomor_telepon = null
  return body
}

module.exports = {
  search,
  getById,
  create,
  edit,
  remove,
}
