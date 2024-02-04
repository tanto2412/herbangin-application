const express = require('express')
const router = express.Router()

const mainController = require('../controllers/mainController')

const userRoutes = require('./user')
const authRoutes = require('./auth')
const customerRoutes = require('./customer')
const salesRoutes = require('./sales')
const productRoutes = require('./products')

const passport = require('../middlewares/authMiddleware')

// Authenticated
router.use(['/users', '/customers', '/sales'], passport.isAuthenticated)

// Define routes
router.get('/', mainController.home)

router.use('/auth', authRoutes)
router.use('/users', userRoutes)
router.use('/customers', customerRoutes)
router.use('/sales', salesRoutes)
router.use('/products', productRoutes)

module.exports = router
