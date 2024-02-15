// models/salesModel.js
const knex = require('../../knexInstance')
const logger = require('../../logger')

async function search({ nama = null, page = 1, pageSize = 20 }) {
  return await knex('sales')
    .where((builder) => {
      // Check if 'name' is provided and apply the condition
      if (nama) {
        builder.where('nama', 'ilike', `%${nama}%`)
      }

      builder.offset((page - 1) * pageSize)
      builder.limit(pageSize)
      builder.orderBy('id')
    })
    .then((rows) => {
      return rows
    })
    .catch(() => {
      return []
    })
}

async function getById(id) {
  return await knex('sales').where('id', id).first()
}

async function create({ nama }) {
  return await knex('sales')
    .insert({
      nama,
    })
    .returning('*')
}

async function edit(id, { nama }) {
  return await knex('sales')
    .update({
      nama,
      updated_at: knex.raw('now()'),
    })
    .where('id', id)
    .returning('*')
}

async function remove(id) {
  return await knex('sales').where('id', id).del('*')
}

module.exports = {
  search,
  getById,
  create,
  edit,
  remove,
}
