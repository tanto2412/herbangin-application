// controllers/giroController.js
const giroModel = require('../models/giroModel')
const logger = require('../../logger')

async function search(req, res) {
  const giros = await giroModel.search(req.query)
  const pagination = {
    result: giros,
    pages: await giroModel.count(req.query),
  }
  res.json(pagination)
}

async function getById(req, res) {
  let giro = await giroModel.getById(req.params.id)

  if (!giro) {
    res.status(404).send('giro not found')
    return
  }

  res.json(giro)
}

async function lunas(req, res) {
  try {
    if (
      req.body.tanggal_pencairan === undefined ||
      req.body.tanggal_pencairan === null
    ) {
      res.status(500).send('tanggal_pencairan must be filled')
      return
    }

    let giro = await giroModel.getById(req.params.id)
    if (giro.status_pembayaran !== giroModel.StatusPembayaran.BELUM_LUNAS) {
      res.status(500).send('status pembayaran must be BELUM LUNAS')
      return
    }

    giro = await giroModel.update(
      req.params.id,
      giroModel.StatusPembayaran.LUNAS,
      req.body.tanggal_pencairan
    )
    if (!giro) {
      res.status(500).send('update failed')
      return
    }

    res.json(giro)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'update failed')
  }
}

async function tolak(req, res) {
  try {
    let giro = await giroModel.getById(req.params.id)
    if (giro.status_pembayaran !== giroModel.StatusPembayaran.BELUM_LUNAS) {
      res.status(500).send('status pembayaran must be BELUM LUNAS')
      return
    }

    giro = await giroModel.update(
      req.params.id,
      giroModel.StatusPembayaran.DITOLAK
    )

    if (!giro) {
      res.status(500).send('update failed')
      return
    }

    res.json(giro)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'update failed')
  }
}

module.exports = {
  search,
  getById,
  lunas,
  tolak,
}
