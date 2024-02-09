// models/paymentModel.js
const knex = require('../../knexInstance')

const JenisPembayaran = {
  TUNAI: 'TUNAI',
  GIRO: 'BG/CEK',
  TRANSFER: 'TRANSFER',
  LAIN_LAIN: 'LAIN LAIN',
}

async function search({ nomor_faktur = null, jenis_pembayaran = null }) {
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
}) {
  return await knex('payment')
    .insert({
      nomor_faktur,
      tanggal,
      jumlah_pembayaran,
      jenis_pembayaran,
      remarks,
    })
    .returning('*')
}

async function edit(
  id,
  { nomor_faktur, tanggal, jumlah_pembayaran, jenis_pembayaran, remarks }
) {
  return await knex('payment')
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
}

async function remove(id) {
  return await knex('payment').where('id', id).del('*')
}

module.exports = {
  JenisPembayaran,
  search,
  getById,
  create,
  edit,
  remove,
}
