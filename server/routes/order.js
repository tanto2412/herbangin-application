const express = require('express')
const router = express.Router()
const orderController = require('../controllers/orderController')
const checkMiddleware = require('../middlewares/checkMiddleware')

const orderParams = ['tanggal_faktur', 'customer_id', 'items']

router.get('/', checkMiddleware.checkPagination(), orderController.search)
router.get('/:id', orderController.getById)

router.put(
  '/:id',
  checkMiddleware.checkMissingParams(orderParams),
  orderController.edit
)

router.post(
  '/',
  checkMiddleware.checkMissingParams(orderParams),
  orderController.create
)

router.delete('/:id', orderController.remove)

module.exports = router
