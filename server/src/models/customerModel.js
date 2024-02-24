// models/customerModel.js
const knex = require('../../knexInstance')
const logger = require('../../logger')

async function search({
  nama_toko = null,
  sales = null,
  page = 1,
  page_size = 20,
}) {
  return await knex('customer')
    .select('customer.*', 'sales.nama as nama_sales')
    .where((builder) => {
      if (nama_toko) {
        builder.where('nama_toko', 'ilike', `%${nama_toko}%`)
      }

      if (sales) {
        builder.where('sales_id', sales)
      }
    })
    .leftJoin('sales', 'sales.id', '=', 'customer.sales_id')
    .modify((queryBuilder) => {
      if (page_size > 0) queryBuilder.limit(page_size)
    })
    .offset((page - 1) * page_size)
    .orderBy('customer.id')
    .then((rows) => {
      return rows
    })
    .catch((error) => {
      logger.error(error)
      return []
    })
}

async function count({ nama_toko = null, sales = null, page_size = 20 }) {
  return await knex('customer')
    .where((builder) => {
      if (nama_toko) {
        builder.where('nama_toko', 'ilike', `%${nama_toko}%`)
      }

      if (sales) {
        builder.where('sales_id', sales)
      }
    })
    .leftJoin('sales', 'sales.id', '=', 'customer.sales_id')
    .count('*')
    .then((result) => {
      return Math.ceil(parseInt(result[0].count, 10) / page_size)
    })
    .catch((error) => {
      console.error(error)
    })
}

async function getById(id) {
  return await knex('customer').where('id', id).first()
}

async function create({
  nama_toko,
  alamat,
  email,
  nomor_telepon,
  nomor_handphone,
  sales_id,
  batas_piutang,
}) {
  return await knex('customer')
    .insert({
      nama_toko,
      sales_id,
      alamat,
      nomor_telepon,
      nomor_handphone,
      email,
      batas_piutang,
    })
    .returning('*')
}

async function edit(
  id,
  {
    nama_toko,
    alamat,
    email,
    nomor_telepon,
    nomor_handphone,
    sales_id,
    batas_piutang,
  }
) {
  return await knex('customer')
    .update({
      nama_toko,
      sales_id,
      alamat,
      nomor_telepon,
      nomor_handphone,
      email,
      batas_piutang,
      updated_at: knex.raw('now()'),
    })
    .where('id', id)
    .returning('*')
}

async function remove(id) {
  return await knex('customer').where('id', id).del('*')
}

module.exports = {
  search,
  count,
  getById,
  create,
  edit,
  remove,
}
