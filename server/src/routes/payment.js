const express = require('express')
const router = express.Router()
const paymentController = require('../controllers/paymentController')
const checkMiddleware = require('../middlewares/checkMiddleware')

const paymentParams = [
  'nomor_faktur',
  'tanggal',
  'jumlah_pembayaran',
  'jenis_pembayaran',
  'payment_group_id',
]

const paymentGroupParams = ['customer_id']

router.get('/', checkMiddleware.checkPagination(), paymentController.search)
router.get(
  '/group',
  checkMiddleware.checkPagination(),
  paymentController.searchGroup
)
router.get(
  '/group/:id',
  checkMiddleware.checkPagination(),
  paymentController.getGroup
)
router.get('/:id', paymentController.getById)

router.put(
  '/group/:id',
  checkMiddleware.checkMissingParams(paymentGroupParams),
  paymentController.editGroup
)
router.put(
  '/:id',
  checkMiddleware.checkMissingParams(paymentParams),
  paymentController.edit
)

router.post(
  '/group',
  checkMiddleware.checkMissingParams(paymentGroupParams),
  paymentController.createGroup
)
router.post(
  '/',
  checkMiddleware.checkMissingParams(paymentParams),
  paymentController.create
)

router.delete('/group/:id', paymentController.removeGroup)
router.delete('/:id', paymentController.remove)

module.exports = router
