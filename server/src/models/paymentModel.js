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
  group = null,
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
      'giro.tanggal_jatuh_tempo',
      'giro.tanggal_pencairan',
      'giro.status_pembayaran',
    )
    .leftJoin('order', 'order.nomor_faktur', '=', 'payment.nomor_faktur')
    .leftJoin('sales', 'sales.id', '=', 'order.sales_id')
    .leftJoin('customer', 'customer.id', '=', 'order.customer_id')
    .leftJoin('giro', 'giro.nomor_pembayaran', '=', 'payment.id')
    .where((builder) => {
      // Check if 'nomor_faktur' is provided and apply the condition
      if (nomor_faktur) {
        builder.andWhere('payment.nomor_faktur', nomor_faktur)
      }

      if (jenis_pembayaran) {
        builder.andWhere('jenis_pembayaran', jenis_pembayaran)
      }

      if (group) {
        builder.andWhere('payment_group_id', group)
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

async function searchGroup({
  nomor = null,
  sales = null,
  customer = null,
  page = 1,
  page_size = 20,
}) {
  return await knex('payment_group')
    .select(
      'payment_group.*',
      'sales.nama as nama_sales',
      'customer.nama_toko',
      'sales.id as sales_id',
    )
    .leftJoin('customer', 'customer.id', '=', 'payment_group.customer_id')
    .leftJoin('sales', 'sales.id', '=', 'customer.sales_id')
    .where((builder) => {
      if (nomor) {
        builder.where('payment_group.id', id)
      }

      if (sales) {
        builder.where('customer.sales_id', sales)
      }

      if (customer) {
        builder.where('customer.id', customer)
      }
    })
    .modify((queryBuilder) => {
      if (page_size > 0) queryBuilder.limit(page_size)
    })
    .offset((page - 1) * page_size)
    .orderBy('payment_group.id')
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

async function countGroup({ sales = null, customer = null, page_size = 20 }) {
  return await knex('payment_group')
    .leftJoin('customer', 'customer.id', '=', 'payment_group.customer_id')
    .where((builder) => {
      if (sales) {
        builder.where('customer.sales_id', sales)
      }

      if (customer) {
        builder.where('customer.id', customer)
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
      'giro.tanggal_jatuh_tempo',
      'giro.tanggal_pencairan',
      'giro.status_pembayaran',
    )
    .leftJoin('order', 'order.nomor_faktur', '=', 'payment.nomor_faktur')
    .leftJoin('sales', 'sales.id', '=', 'order.sales_id')
    .leftJoin('customer', 'customer.id', '=', 'order.customer_id')
    .leftJoin('giro', 'giro.nomor_pembayaran', '=', 'payment.id')
    .where('payment.id', id)
    .first()
}

async function getGroup(id) {
  return await knex('payment_group')
    .select('payment_group.*', 'sales.nama as nama_sales', 'customer.nama_toko')
    .leftJoin('customer', 'customer.id', '=', 'payment_group.customer_id')
    .leftJoin('sales', 'sales.id', '=', 'customer.sales_id')
    .where('payment_group.id', id)
    .first()
}

async function getByOrderIds(ids) {
  return await knex('payment')
    .select(
      'payment.*',
      'sales.nama as nama_sales',
      'customer.nama_toko',
      'giro.id as giro_id',
      'giro.nomor_giro',
      'giro.tanggal_jatuh_tempo',
      'giro.tanggal_pencairan',
      'giro.status_pembayaran',
    )
    .leftJoin('order', 'order.nomor_faktur', '=', 'payment.nomor_faktur')
    .leftJoin('sales', 'sales.id', '=', 'order.sales_id')
    .leftJoin('customer', 'customer.id', '=', 'order.customer_id')
    .leftJoin('giro', 'giro.nomor_pembayaran', '=', 'payment.id')
    .whereIn('payment.nomor_faktur', ids)
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
  payment_group_id,
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
            nama_bank,
            payment_group_id,
          })
          .onConflict('id')
          .merge()
          .returning('*')
      )[0]

      if (payment.jenis_pembayaran == JenisPembayaran.GIRO) {
        let giroSpec = {
          nomor_faktur,
          nomor_pembayaran: payment.id,
          nomor_giro,
          tanggal_jatuh_tempo,
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
  },
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
            nama_bank,
            updated_at: knex.raw('now()'),
          })
          .where('id', id)
          .returning('*')
      )[0]

      if (!payment) {
        trx.rollback()
        return null
      }

      if (payment.jenis_pembayaran == JenisPembayaran.GIRO) {
        let giroSpec = {
          nomor_faktur,
          nomor_pembayaran: payment.id,
          nomor_giro,
          tanggal_jatuh_tempo,
          jenis_pembayaran,
        }
        let giro = await giroModel.editByPaymentId(giroSpec, trx)
        if (!giro || !giro.length) {
          await trx.rollback()
          return null
        }
      } else {
        let giro = await giroModel.removeByPaymentIds([payment.id], trx)
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
        let giro = await giroModel.removeByPaymentIds([payment.id], trx)
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

async function removeByPaymentGroupId(id, trx = knex) {
  let payments = await trx('payment').where('payment_group_id', id).del('*')
  let paymentIds = payments.map((payment) => payment.id)

  giroModel.removeByPaymentIds(paymentIds, trx)

  return payments
}

async function removeByOrderId(id, trx) {
  await giroModel.removeByOrderId(id, trx)

  let payments = await trx('payment').where('nomor_faktur', id).del('*')

  return payments
}

async function createGroup({ customer_id }) {
  try {
    return (
      await knex('payment_group')
        .insert({
          customer_id,
        })
        .returning('*')
    )[0]
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function editGroup(id, { customer_id }) {
  try {
    return await knex.transaction(async (trx) => {
      removeByPaymentGroupId(id, trx)

      paymentGroup = (
        await trx('payment_group')
          .update({
            customer_id,
          })
          .where('id', id)
          .returning('*')
      )[0]

      if (!paymentGroup) {
        trx.rollback()
        return null
      }

      return paymentGroup
    })
  } catch (error) {
    logger.error(error)
    return null
  }
}

async function removeGroup(id) {
  try {
    return await knex('payment_group').where('id', id).del('*')
  } catch (error) {
    logger.error(error)
    return null
  }
}

module.exports = {
  JenisPembayaran,
  search,
  searchGroup,
  count,
  countGroup,
  getById,
  getGroup,
  getByOrderIds,
  create,
  edit,
  remove,
  removeByOrderId,
  createGroup,
  editGroup,
  removeGroup,
}
