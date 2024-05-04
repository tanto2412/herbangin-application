/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('customer')
    .del()
    .then(async function () {
      // Inserts seed entries
      return knex('customer').insert([
        {
          nama_toko: 'Toko Intan Gading',
          sales_id: 1,
          alamat: 'Kelapa Nias',
          nomor_telepon: '0818181818',
          nomor_handphone: '0818181818',
          batas_piutang: 40000000,
        },
      ])
    })
}
