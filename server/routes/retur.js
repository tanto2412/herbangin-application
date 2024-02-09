const express = require('express')
const router = express.Router()
const returController = require('../controllers/returController')
const checkMiddleware = require('../middlewares/checkMiddleware')

const returParams = ['tanggal', 'nomor_faktur', 'items']

router.get('/', returController.search)
router.get('/:id', returController.getById)

router.put(
  '/:id',
  checkMiddleware.checkMissingParams(returParams),
  returController.edit
)

router.post(
  '/',
  checkMiddleware.checkMissingParams(returParams),
  returController.create
)

router.delete('/:id', returController.remove)

module.exports = router
