const express = require('express')
const router = express.Router()
const salesController = require('../controllers/salesController')
const checkMiddleware = require('../middlewares/checkMiddleware')

const salesParams = ['nama']

router.get('/', salesController.search)
router.get('/:id', salesController.getById)

router.put(
  '/:id',
  checkMiddleware.checkMissingParams(salesParams),
  salesController.edit
)

router.post(
  '/',
  checkMiddleware.checkMissingParams(salesParams),
  salesController.create
)

router.delete('/:id', salesController.remove)

module.exports = router
