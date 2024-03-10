// controllers/userController.js
const userModel = require('../models/userModel')
const logger = require('../../logger')

async function search(req, res) {
  const users = await userModel.search()

  results = users.map((user) => {
    delete user.password
    return user
  })
  res.json(results)
}

async function getById(req, res) {
  const user = await userModel.getById(req.params.id)

  if (!user) {
    res.status(404).send('user not found')
    return
  }

  delete user.password
  res.json(user)
}

async function changePassword(req, res) {
  const curUser = await req.user
  const users = await userModel.updatePassword(curUser.id, req.body.password)

  if (!users) {
    res.status(404).send('user not found')
    return
  }

  const user = users[0]
  delete user.password
  res.json(user)
}

async function create(req, res) {
  try {
    const users = await userModel.createUser(req.body)

    if (!users.length) {
      res.status(500).send('insert failed')
      return
    }

    const user = users[0]
    delete user.password
    res.json(user)
  } catch (error) {
    logger.error(error)
    res.status(500).send(error.detail ? error.detail : 'insert failed')
  }
}

async function remove(req, res) {
  const users = await userModel.deleteUser(req.params.id)

  if (!users.length) {
    res.status(404).send('user not found')
    return
  }

  const user = users[0]
  delete user.password
  res.json(user)
}

module.exports = {
  search,
  getById,
  changePassword,
  create,
  remove,
}
