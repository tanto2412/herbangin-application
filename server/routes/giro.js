const express = require('express')
const router = express.Router()
const giroController = require('../controllers/giroController')

router.get('/', giroController.search)
router.get('/:id', giroController.getById)

router.put('/:id/lunas', giroController.lunas)
router.put('/:id/tolak', giroController.tolak)

module.exports = router
