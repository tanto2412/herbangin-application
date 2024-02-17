const express = require('express')
const router = express.Router()
const laporanController = require('../controllers/laporanController')

router.get('/penjualan', laporanController.penjualan)
router.get('/giro-belum-dibayar', laporanController.giroBlmDibayar)
router.get('/giro-ditolak', laporanController.giroDitolak)
router.get('/piutang', laporanController.piutang)
router.get('/pembayaran', laporanController.pembayaran)
router.get('/penerimaan', laporanController.penerimaan)
router.get('/retur', laporanController.retur)

module.exports = router
