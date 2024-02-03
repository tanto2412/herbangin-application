// controllers/userController.js
const userModel = require('../models/userModel')

async function getUserById(req, res) {
  const user = await userModel.getUserById(req.params.id)

  if (!user) {
    res.status(404).send('user not found')
    return
  }

  delete user.password
  res.json(user)
}

async function changePassword(req, res) {
  const users = await userModel.updatePassword(req.params.id, req.body.password)

  if (!users) {
    res.status(404).send('user not found')
    return
  }

  const user = users[0]
  delete user.password
  res.json(user)
}

module.exports = {
  getUserById,
  changePassword,
}
