const express = require('express')
const router = express.Router()

const mainController = require('../controllers/mainController')

const userRoutes = require('./user')
const authRoutes = require('./auth')
const customerRoutes = require('./customer')

const passport = require('../middlewares/authMiddleware')

// Authenticated
router.use('/users', passport.isAuthenticated)

// Define routes
router.get('/', mainController.home)

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/customers', customerRoutes)

module.exports = router
