// models/customerModel.js
const bcrypt = require('bcrypt')
const knex = require('../../knexInstance')

async function search({ nama = null, sales = null }) {
  return await knex('customer')
    .where((builder) => {
      // Check if 'name' is provided and apply the condition
      if (nama) {
        builder.where('lower(nama)', 'like', `%${nama.toLowerCase()}%`)
      }

      // Check if 'sales' is provided and apply the condition
      if (sales) {
        builder.where('sales_id', sales)
      }
    })
    .then((rows) => {
      return rows
    })
    .catch(() => {
      return null
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
    })
    .where('id', id)
    .returning('*')
}

async function remove(id) {
  return await knex('customer').where('id', id).del('*')
}

module.exports = {
  search,
  getById,
  create,
  edit,
  remove,
}
