// models/productModel.js
const knex = require('../../knexInstance')

// Enum-like object for roles
const JenisBarang = {
  FAST_MOVING: 'FAST MOVING',
  SLOW_MOVING: 'SLOW MOVING',
}

async function search({ kode_barang = null, nama_barang = null }) {
  return await knex('product')
    .where((builder) => {
      // Check if 'name' is provided and apply the condition
      if (nama_barang) {
        builder.where('nama_barang', 'ilike', `%${nama_barang}%`)
      }

      if (kode_barang) {
        builder.where('kode_barang', 'ilike', `%${kode_barang}%`)
      }
    })
    .then((rows) => {
      return rows
    })
    .catch(() => {
      return []
    })
}

async function getById(id) {
  return await knex('product').where('id', id).first()
}

async function create({
  kode_barang,
  nama_barang,
  satuan_terkecil,
  harga,
  jenis_barang,
  batas_fast_moving,
}) {
  return await knex('product')
    .insert({
      kode_barang,
      nama_barang,
      satuan_terkecil,
      harga,
      jenis_barang,
      batas_fast_moving,
      stok_barang: 0,
    })
    .returning('*')
}

async function edit(
  id,
  {
    kode_barang,
    nama_barang,
    satuan_terkecil,
    harga,
    jenis_barang,
    batas_fast_moving,
  }
) {
  return await knex('product')
    .update({
      kode_barang,
      nama_barang,
      satuan_terkecil,
      harga,
      jenis_barang,
      batas_fast_moving,
      updated_at: knex.raw('now()'),
    })
    .where('id', id)
    .returning('*')
}

async function remove(id) {
  return await knex('product').where('id', id).del('*')
}

module.exports = {
  JenisBarang,
  search,
  getById,
  create,
  edit,
  remove,
}
