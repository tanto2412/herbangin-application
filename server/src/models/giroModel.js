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
  page_size = 20,
}) {
  return await knex('giro')
    .select('giro.*', 'payment.nama_bank')
    .leftJoin('payment', 'payment.id', '=', 'giro.nomor_pembayaran')
    .where((builder) => {
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
    .modify((queryBuilder) => {
      if (page_size > 0) queryBuilder.limit(page_size)
    })
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
  nomor_faktur = null,
  nomor_pembayaran = null,
  nomor_giro = null,
  status_pembayaran = null,
  page_size = 20,
}) {
  return await knex('giro')
    .where((builder) => {
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
    .count('*')
    .then((result) => {
      return Math.ceil(parseInt(result[0].count, 10) / page_size)
    })
    .catch((error) => {
      console.error(error)
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
    status_pembayaran = StatusPembayaran.BELUM_LUNAS,
    tanggal_pencairan = null,
  },
  trx = null
) {
  if (!trx) {
    trx = knex
  }
  return await trx('giro')
    .insert({
      nomor_faktur,
      nomor_giro,
      nomor_pembayaran,
      tanggal_jatuh_tempo,
      status_pembayaran,
      tanggal_pencairan,
    })
    .onConflict(
      knex.raw(`
          ("nomor_pembayaran") DO UPDATE SET 
          nomor_faktur = EXCLUDED.nomor_faktur,
          nomor_giro = EXCLUDED.nomor_giro,
          tanggal_jatuh_tempo = EXCLUDED.tanggal_jatuh_tempo,
          status_pembayaran = EXCLUDED.status_pembayaran,
          tanggal_pencairan = EXCLUDED.tanggal_pencairan,
          updated_at = EXCLUDED.updated_at
        ON CONFLICT("id") DO UPDATE SET 
          nomor_faktur = EXCLUDED.nomor_faktur,
          nomor_giro = EXCLUDED.nomor_giro,
          tanggal_jatuh_tempo = EXCLUDED.tanggal_jatuh_tempo,
          status_pembayaran = EXCLUDED.status_pembayaran,
          tanggal_pencairan = EXCLUDED.tanggal_pencairan,
          nomor_pembayaran = EXCLUDED.nomor_pembayaran,
          created_at = EXCLUDED.created_at
          updated_at = EXCLUDED.updated_at
      `)
    )
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
  count,
  getById,
  getByPaymentId,
  editByPaymentId,
  create,
  update,
  remove,
  removeByPaymentId,
  removeByOrderId,
}
