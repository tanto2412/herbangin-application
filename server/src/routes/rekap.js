const express = require('express')
const router = express.Router()
const rekapController = require('../controllers/rekapController')

router.get('/penjualan', rekapController.penjualan)
router.get('/giro-belum-dibayar', rekapController.giroBlmDibayar)
router.get('/giro-ditolak', rekapController.giroDitolak)
router.get('/piutang', rekapController.piutang)
router.get('/pembayaran', rekapController.pembayaran)
router.get('/penerimaan', rekapController.penerimaan)
router.get('/retur', rekapController.retur)

module.exports = router
