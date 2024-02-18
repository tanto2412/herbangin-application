const express = require('express')
const router = express.Router()
const customerController = require('../controllers/customerController')
const checkMiddleware = require('../middlewares/checkMiddleware')

const customerParams = ['nama_toko', 'alamat', 'batas_piutang', 'sales_id']

router.get('/', checkMiddleware.checkPagination(), customerController.search)
router.get('/:id', customerController.getById)

router.put(
  '/:id',
  checkMiddleware.checkMissingParams(customerParams),
  customerController.edit
)

router.post(
  '/',
  checkMiddleware.checkMissingParams(customerParams),
  customerController.create
)

router.delete('/:id', customerController.remove)

module.exports = router
