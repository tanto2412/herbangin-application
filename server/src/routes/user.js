const express = require('express')
const router = express.Router()
const userController = require('../controllers/userController')
const checkMiddleware = require('../middlewares/checkMiddleware')
const passport = require('../middlewares/authMiddleware')

const userParams = ['nama', 'password', 'administrator']

router.get('/:id', userController.getById)
router.get('', passport.isAdministrator, userController.search)

router.put('', userController.changePassword)

router.post(
  '/',
  [passport.isAdministrator, checkMiddleware.checkMissingParams(userParams)],
  userController.create
)

router.delete('/:id', userController.remove)

module.exports = router
