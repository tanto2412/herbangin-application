// models/giroModel.js
const knex = require('../../knexInstance')
const logger = require('../../logger')

const StatusPembayaran = {
  BELUM_LUNAS: 'BELUM_LUNAS',
  LUNAS: 'LUNAS',
  DITOLAK: 'DITOLAK',
}

async function search({
  nomor_faktur = null,
  nomor_pembayaran = null,
  nomor_giro = null,
  status_pembayaran = null,
  page = 1,
  pageSize = 20,
}) {
  return await knex('giro')
    .where((builder) => {
      // Check if 'nomor_faktur' is provided and apply the condition
      if (nomor_faktur) {
        builder.where('nomor_faktur', nomor_faktur)
      }

      if (nomor_pembayaran) {
        builder.where('nomor_pembayaran', nomor_pembayaran)
      }

      if (nomor_giro) {
        builder.where('nomor_giro', 'ILIKE', `%${nomor_giro}%`)
      }

      if (status_pembayaran) {
        builder.where('status_pembayaran', status_pembayaran)
      }
    })
    .limit(pageSize === 0 ? null : pageSize)
    .offset((page - 1) * pageSize)
    .orderBy('id')
    .then((rows) => {
      return rows
    })
    .catch(() => {
      return []
    })
}

async function update(id, status_pembayaran, tanggal_pencairan = null) {
  return await knex('giro')
    .update({
      status_pembayaran,
      tanggal_pencairan,
      updated_at: knex.raw('now()'),
    })
    .where('id', id)
    .returning('*')
}

async function getById(id) {
  return await knex('giro').where('id', id).first()
}

async function getByPaymentId(nomor_pembayaran, trx) {
  if (!trx) {
    trx = knex
  }
  return await trx('giro').where('nomor_pembayaran', nomor_pembayaran).first()
}

async function create(
  {
    nomor_faktur,
    nomor_pembayaran,
    nomor_giro,
    tanggal_jatuh_tempo,
    nama_bank,
    status_pembayaran = StatusPembayaran.BELUM_LUNAS,
  },
  trx = null
) {
  if (!trx) {
    trx = knex
  }
  return await trx('giro')
    .insert({
      nomor_faktur,
      nomor_pembayaran,
      nomor_giro,
      tanggal_jatuh_tempo,
      nama_bank,
      status_pembayaran,
    })
    .returning('*')
}

async function editByPaymentId(
  {
    nomor_faktur,
    nomor_pembayaran,
    nomor_giro,
    tanggal_jatuh_tempo,
    nama_bank,
    status_pembayaran = StatusPembayaran.BELUM_LUNAS,
  },
  trx = null
) {
  if (!trx) {
    trx = knex
  }
  return await trx('giro')
    .update({
      nomor_faktur,
      nomor_giro,
      tanggal_jatuh_tempo,
      nama_bank,
      status_pembayaran,
    })
    .where('nomor_pembayaran', nomor_pembayaran)
    .returning('*')
}

async function remove(ids, trx) {
  if (!trx) {
    trx = knex
  }
  return await trx('giro').whereIn('id', ids).del('*')
}

async function removeByPaymentId(id, trx) {
  if (!trx) {
    trx = knex
  }
  return await trx('giro').where('nomor_pembayaran', id).del('*')
}

async function removeByOrderId(id, trx) {
  if (!trx) {
    trx = knex
  }
  return await trx('giro').where('nomor_faktur', id).del('*')
}

module.exports = {
  StatusPembayaran,
  search,
  getById,
  getByPaymentId,
  editByPaymentId,
  create,
  update,
  remove,
  removeByPaymentId,
  removeByOrderId,
}
