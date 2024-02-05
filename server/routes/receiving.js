const express = require('express')
const router = express.Router()
const receivingController = require('../controllers/receivingController')
const checkMiddleware = require('../middlewares/checkMiddleware')

const receivingParams = ['tanggal', 'items']

router.get('/', receivingController.search)
router.get('/:id', receivingController.getById)

router.put(
  '/:id',
  checkMiddleware.checkMissingParams(receivingParams),
  receivingController.edit
)

router.post(
  '/',
  checkMiddleware.checkMissingParams(receivingParams),
  receivingController.create
)

router.delete('/:id', receivingController.remove)

module.exports = router
