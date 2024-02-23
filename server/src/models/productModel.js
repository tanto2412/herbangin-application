// models/productModel.js
const knex = require('../../knexInstance')
const logger = require('../../logger')

const JenisBarang = {
  FAST_MOVING: 'FAST MOVING',
  SLOW_MOVING: 'SLOW MOVING',
}

const ReferenceType = {
  RECEIVING: 'PENERIMAAN',
  ORDER: 'PENJUALAN',
  RETUR: 'RETUR',
}

async function search({
  kode_barang = null,
  nama_barang = null,
  page = 1,
  page_size = 20,
}) {
  return await knex('product')
    .where((builder) => {
      if (nama_barang) {
        builder.where('nama_barang', 'ilike', `%${nama_barang}%`)
      }

      if (kode_barang) {
        builder.where('kode_barang', 'ilike', `%${kode_barang}%`)
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

async function count({
  kode_barang = null,
  nama_barang = null,
  page_size = 20,
}) {
  return await knex('product')
    .where((builder) => {
      if (nama_barang) {
        builder.where('nama_barang', 'ilike', `%${nama_barang}%`)
      }

      if (kode_barang) {
        builder.where('kode_barang', 'ilike', `%${kode_barang}%`)
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
  return await knex('product').where('id', id).first()
}

async function getByIds(ids) {
  return await knex('product').whereIn('id', ids)
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

async function updateStock(specs, trx = null) {
  if (!trx) {
    trx = knex
  }

  const updatePromises = specs.map(({ product_id, stok_diff }) => {
    return trx('product')
      .where('id', product_id)
      .update({
        stok_barang: knex.raw('stok_barang + ?', [stok_diff]),
        updated_at: knex.raw('now()'),
      })
      .returning('*')
  })

  const updatedRows = await Promise.all(updatePromises)
    .then((updated) => updated.flatMap((i) => i))
    .catch((error) => {
      logger.error(error)
    })

  let updatedMap = new Map()
  for (let updated of updatedRows) {
    updatedMap.set(updated.id, updated.stok_barang)
  }

  const historySpecs = specs.map(
    ({ product_id, stok_diff, reference_type, reference_id }) => {
      return {
        product_id,
        stok_sebelum: updatedMap.get(product_id) - stok_diff,
        stok_sesudah: updatedMap.get(product_id),
        reference_type,
        reference_id,
      }
    }
  )

  const insertedHistory = await trx('product_history')
    .insert(historySpecs)
    .returning('*')
  if (!insertedHistory || !insertedHistory.length) return null

  return updatedRows
}

module.exports = {
  JenisBarang,
  ReferenceType,
  search,
  count,
  getById,
  getByIds,
  create,
  edit,
  remove,
  updateStock,
}
