const express = require('express')
const router = express.Router()
const productController = require('../controllers/productController')
const checkMiddleware = require('../middlewares/checkMiddleware')

const productParams = [
  'kode_barang',
  'nama_barang',
  'harga',
  'satuan_terkecil',
  'jenis_barang',
]

router.get('/', checkMiddleware.checkPagination(), productController.search)
router.get('/:id', productController.getById)

router.put(
  '/:id',
  checkMiddleware.checkMissingParams(productParams),
  productController.edit
)

router.post(
  '/',
  checkMiddleware.checkMissingParams(productParams),
  productController.create
)

router.delete('/:id', productController.remove)

module.exports = router
