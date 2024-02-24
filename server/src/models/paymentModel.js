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
  page_size = 20,
}) {
  return await knex('payment')
    .select(
      'payment.*',
      'sales.nama as nama_sales',
      'customer.nama_toko',
      'giro.id as giro_id',
      'giro.nomor_giro',
      'giro.nama_bank',
      'giro.tanggal_jatuh_tempo',
      'giro.tanggal_pencairan',
      'giro.status_pembayaran'
    )
    .leftJoin('order', 'order.nomor_faktur', '=', 'payment.nomor_faktur')
    .leftJoin('sales', 'sales.id', '=', 'order.sales_id')
    .leftJoin('customer', 'customer.id', '=', 'order.customer_id')
    .leftJoin('giro', 'giro.nomor_pembayaran', '=', 'payment.id')
    .where((builder) => {
      // Check if 'nomor_faktur' is provided and apply the condition
      if (nomor_faktur) {
        builder.where('payment.nomor_faktur', nomor_faktur)
      }

      if (jenis_pembayaran) {
        builder.where('jenis_pembayaran', jenis_pembayaran)
      }
    })
    .modify((queryBuilder) => {
      if (page_size > 0) queryBuilder.limit(page_size)
    })
    .offset((page - 1) * page_size)
    .orderBy('payment.id')
    .then((rows) => {
      return rows
    })
    .catch(() => {
      return []
    })
}

async function count({
  nomor_faktur = null,
  jenis_pembayaran = null,
  page_size = 20,
}) {
  return await knex('payment')
    .where((builder) => {
      if (nomor_faktur) {
        builder.where('nomor_faktur', nomor_faktur)
      }

      if (jenis_pembayaran) {
        builder.where('jenis_pembayaran', jenis_pembayaran)
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
  return await knex('payment')
    .select(
      'payment.*',
      'sales.nama as nama_sales',
      'customer.nama_toko',
      'giro.id as giro_id',
      'giro.nomor_giro',
      'giro.nama_bank',
      'giro.tanggal_jatuh_tempo',
      'giro.tanggal_pencairan',
      'giro.status_pembayaran'
    )
    .leftJoin('order', 'order.nomor_faktur', '=', 'payment.nomor_faktur')
    .leftJoin('sales', 'sales.id', '=', 'order.sales_id')
    .leftJoin('customer', 'customer.id', '=', 'order.customer_id')
    .leftJoin('giro', 'giro.nomor_pembayaran', '=', 'payment.id')
    .where('payment.id', id)
    .first()
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
    jenis_pembayaran,
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
            jenis_pembayaran,
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
          jenis_pembayaran,
          nama_bank,
        }
        let giro = await giroModel.editByPaymentId(giroSpec, trx)
        if (!giro || !giro.length) {
          await trx.rollback()
          return null
        }
      } else {
        let giro = await giroModel.removeByPaymentId(payment.id, trx)
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
      let payment = await getById(id)

      if (payment.jenis_pembayaran == JenisPembayaran.GIRO) {
        let giro = await giroModel.removeByPaymentId(payment.id, trx)
        if (!giro || !giro.length) {
          await trx.rollback()
          return null
        }
      }

      payment = (await trx('payment').where('id', id).del('*'))[0]

      return payment
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function removeByOrderId(id, trx) {
  await giroModel.removeByOrderId(id, trx)

  let payments = await trx('payment').where('nomor_faktur', id).del('*')

  return payments
}

module.exports = {
  JenisPembayaran,
  search,
  count,
  getById,
  create,
  edit,
  remove,
  removeByOrderId,
}
