const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')

router.get('/:id', userController.getUserById)
router.put('/:id', userController.changePassword)

module.exports = router
