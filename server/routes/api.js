const express = require('express')
const router = express.Router()

// Import the main controller
const mainController = require('../controllers/mainController')

// Define routes
router.get('/', mainController.home)

module.exports = router
