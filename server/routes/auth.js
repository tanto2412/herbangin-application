const express = require('express')
const router = express.Router()
const passport = require('../middlewares/authMiddleware')
const userModel = require('../models/userModel')

router.post(
  '/login',
  passport.passport.authenticate('local'),
  async (req, res) => {
    const user = await userModel.getUserByUsername(req.body.username)
    delete user.password
    res.json(user)
  }
)

router.get('/logout', passport.isAuthenticated, (req, res) => {
  req.logout(() => {
    res.json({ message: 'Logout successful' })
  })
})

module.exports = router
