const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/paymentController')
const checkMiddleware = require('../middlewares/checkMiddleware')

const paymentParams = [
  'nomor_faktur',
  'tanggal',
  'jumlah_pembayaran',
  'jenis_pembayaran',
]

router.get('/', checkMiddleware.checkPagination(), paymentController.search)
router.get('/:id', paymentController.getById)

router.put(
  '/:id',
  checkMiddleware.checkMissingParams(paymentParams),
  paymentController.edit
)

router.post(
  '/',
  checkMiddleware.checkMissingParams(paymentParams),
  paymentController.create
)

router.delete('/:id', paymentController.remove)

module.exports = router
