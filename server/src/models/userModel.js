// models/userModel.js
const bcrypt = require('bcrypt')
const knex = require('../../knexInstance')
const logger = require('../../logger')

async function search() {
  return await knex('user')
    .then((rows) => {
      return rows
    })
    .catch(() => {
      return []
    })
}

async function getByUsername(userName) {
  const user = await knex('user').where('nama', userName).first()

  if (!user) {
    return null
  }

  return user
}

async function getById(id) {
  const user = await knex('user').where('id', id).first()

  if (!user) {
    return null
  }

  return user
}

async function createUser({ nama, password, administrator }) {
  const hashedPassword = await bcrypt.hash(password, 10)

  // Store the hashed password in the database
  return await knex('user')
    .insert({
      nama,
      password: hashedPassword,
      administrator,
    })
    .returning('*')
}

async function updatePassword(id, password) {
  const hashedPassword = await bcrypt.hash(password, 10)

  // Store the hashed password in the database
  return await knex('user')
    .update({
      password: hashedPassword,
    })
    .where('id', id)
    .returning('*')
}

async function deleteUser(id) {
  return await knex('user').where('id', id).del('*')
}

module.exports = {
  search,
  getByUsername,
  getById,
  updatePassword,
  createUser,
  deleteUser,
}
