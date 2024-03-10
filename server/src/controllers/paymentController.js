// controllers/paymentController.js
const paymentModel = require('../models/paymentModel')
const orderModel = require('../models/orderModel')
const returModel = require('../models/returModel')
const logger = require('../../logger')

async function search(req, res) {
  const payments = await paymentModel.search(req.query)
  const pagination = {
    result: payments,
    pages: await paymentModel.count(req.query),
  }
  res.json(pagination)
}

async function getById(req, res) {
  let payment = await paymentModel.getById(req.params.id)

  if (!payment) {
    res.status(404).send('payment not found')
    return
  }

  res.json(payment)
}

async function create(req, res) {
  try {
    let errorMessage = await checkPaymentAmount(req.params.id, req.body)
    if (errorMessage) {
      res.status(500).send(errorMessage)
      return
    }

    errorMessage = await checkParams(req.body)
    if (errorMessage) {
      res.status(500).send(errorMessage)
      return
    }

    const payment = await paymentModel.create(req.body)
    if (!payment) {
      res.status(500).send('insert failed')
      return
    }

    res.json(payment)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'insert failed')
  }
}

async function edit(req, res) {
  try {
    let errorMessage = await checkPaymentAmount(req.params.id, req.body)
    if (errorMessage) {
      res.status(500).send(errorMessage)
      return
    }

    const payment = await paymentModel.edit(req.params.id, req.body)

    if (!payment) {
      res.status(500).send('edit failed')
      return
    }

    res.json(payment)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'edit failed')
  }
}

async function remove(req, res) {
  try {
    const payment = await paymentModel.remove(req.params.id)

    if (!payment) {
      res.status(500).send('delete failed')
      return
    }

    res.json(payment)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'delete failed')
  }
}

async function checkPaymentAmount(
  id,
  { nomor_faktur, jumlah_pembayaran, jenis_pembayaran, remarks }
) {
  if (!(jenis_pembayaran in paymentModel.JenisPembayaran)) {
    return 'jenis_pembayaran must be [TUNAI, GIRO, TRANSFER, LAIN_LAIN]'
  }

  if (jumlah_pembayaran <= 0) {
    return 'jumlah_pembayaran must be > 0'
  }

  let order = await orderModel.getById(nomor_faktur)
  if (!order) {
    return `nomor faktur ${nomor_faktur} not found`
  }

  let existingPayments = await paymentModel.search({ nomor_faktur })
  let existingAmount = order.total
  for (let payment of existingPayments) {
    if (payment.id != id) {
      existingAmount -= payment.jumlah_pembayaran
    }
  }

  let existingRetur = await returModel.search({ nomor_faktur })
  for (let retur of existingRetur) {
    existingAmount -= retur.total
  }

  if (jumlah_pembayaran != 0 && jumlah_pembayaran > existingAmount) {
    return `exceed outstanding amount: ${existingAmount}`
  }

  return null
}

async function checkParams({
  jenis_pembayaran,
  nomor_giro,
  nama_bank,
  tanggal_jatuh_tempo,
}) {
  if (jenis_pembayaran == paymentModel.JenisPembayaran.TRANSFER) {
    if (nama_bank === undefined || nama_bank === null) {
      return 'missing nama_bank'
    }
  }
  if (jenis_pembayaran == paymentModel.JenisPembayaran.GIRO) {
    if (nomor_giro === undefined || nomor_giro === null) {
      return 'missing nomor_giro'
    }

    if (nama_bank === undefined || nama_bank === null) {
      return 'missing nama_bank'
    }

    if (tanggal_jatuh_tempo === undefined || tanggal_jatuh_tempo === null) {
      return 'missing tanggal_jatuh_tempo'
    }
  }

  return null
}

module.exports = {
  search,
  getById,
  create,
  edit,
  remove,
}
