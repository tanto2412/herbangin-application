// models/salesModel.js
const knex = require('../../knexInstance')
const logger = require('../../logger')

async function search({ nama = null, page = 1, page_size = 20 }) {
  return await knex('sales')
    .where((builder) => {
      if (nama) {
        builder.where('nama', 'ilike', `%${nama}%`)
      }
    })
    .limit(page_size === 0 ? null : page_size)
    .offset((page - 1) * page_size)
    .orderBy('id')
    .then((rows) => {
      return rows
    })
    .catch(() => {
      return []
    })
}

async function count({ nama = null, page_size = 20 }) {
  return await knex('sales')
    .where((builder) => {
      if (nama) {
        builder.where('nama', 'ilike', `%${nama}%`)
      }
    })
    .count('*')
    .then((result) => {
      return Math.ceil(parseInt(result[0].count, 10) / page_size)
    })
    .catch((error) => {
      console.error(error)
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
  count,
  getById,
  create,
  edit,
  remove,
}
