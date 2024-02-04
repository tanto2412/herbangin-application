// models/userModel.js
const bcrypt = require('bcrypt')
const knex = require('../../knexInstance')

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

async function createUser(nama, password) {
  const hashedPassword = await bcrypt.hash(password, 10)

  // Store the hashed password in the database
  await knex('user').insert({
    nama,
    password: hashedPassword,
    administrator: true,
  })
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

module.exports = {
  getByUsername,
  getById,
  updatePassword,
}
