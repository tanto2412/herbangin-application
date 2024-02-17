// models/paymentModel.js
const knex = require('../../knexInstance')
const logger = require('../../logger')
const giroModel = require('./giroModel')

const JenisPembayaran = {
  TUNAI: 'TUNAI',
  GIRO: 'GIRO',
  TRANSFER: 'TRANSFER',
  LAIN_LAIN: 'LAIN LAIN',
}

async function search({
  nomor_faktur = null,
  jenis_pembayaran = null,
  page = 1,
  pageSize = 20,
}) {
  return await knex('payment')
    .where((builder) => {
      // Check if 'nomor_faktur' is provided and apply the condition
      if (nomor_faktur) {
        builder.where('nomor_faktur', nomor_faktur)
      }

      if (jenis_pembayaran) {
        builder.where('jenis_pembayaran', jenis_pembayaran)
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

async function getById(id) {
  return await knex('payment').where('id', id).first()
}

async function create({
  nomor_faktur,
  tanggal,
  jumlah_pembayaran,
  jenis_pembayaran,
  remarks,
  nomor_giro,
  tanggal_jatuh_tempo,
  nama_bank,
}) {
  try {
    return await knex.transaction(async (trx) => {
      let payment = (
        await trx('payment')
          .insert({
            nomor_faktur,
            tanggal,
            jumlah_pembayaran,
            jenis_pembayaran,
            remarks,
          })
          .returning('*')
      )[0]

      if (payment.jenis_pembayaran == JenisPembayaran.GIRO) {
        let giroSpec = {
          nomor_faktur,
          nomor_pembayaran: payment.id,
          nomor_giro,
          tanggal_jatuh_tempo,
          nama_bank,
        }
        let giro = await giroModel.create(giroSpec, trx)
        if (!giro || !giro.length) {
          await trx.rollback()
          return null
        }
      }

      return payment
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function edit(
  id,
  {
    nomor_faktur,
    tanggal,
    jumlah_pembayaran,
    remarks,
    nomor_giro,
    tanggal_jatuh_tempo,
    nama_bank,
  }
) {
  try {
    return await knex.transaction(async (trx) => {
      let payment = (
        await trx('payment')
          .update({
            nomor_faktur,
            tanggal,
            jumlah_pembayaran,
            remarks,
            updated_at: knex.raw('now()'),
          })
          .where('id', id)
          .returning('*')
      )[0]

      if (payment.jenis_pembayaran == JenisPembayaran.GIRO) {
        let giroSpec = {
          nomor_faktur,
          nomor_pembayaran: payment.id,
          nomor_giro,
          tanggal_jatuh_tempo,
          nama_bank,
        }
        let giro = await giroModel.editByPaymentId(giroSpec, trx)
        if (!giro || !giro.length) {
          await trx.rollback()
          return null
        }
      }

      return payment
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function remove(id) {
  try {
    return await knex.transaction(async (trx) => {
      let payment = (await trx('payment').where('id', id).del('*'))[0]

      if (payment.jenis_pembayaran == JenisPembayaran.GIRO) {
        let giro = await giroModel.removeByPaymentId(payment.id, trx)
        if (!giro || !giro.length) {
          await trx.rollback()
          return null
        }
      }

      return payment
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function removeByOrderId(id, trx) {
  let payments = await trx('payment').where('nomor_faktur', id).del('*')

  await giroModel.removeByOrderId(id, trx)

  return payments
}

module.exports = {
  JenisPembayaran,
  search,
  getById,
  create,
  edit,
  remove,
  removeByOrderId,
}
