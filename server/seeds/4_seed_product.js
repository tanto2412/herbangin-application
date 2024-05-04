/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('product')
    .del()
    .then(async function () {
      // Inserts seed entries
      return knex('product').insert([
        {
          kode_barang: 'B1',
          nama_barang: 'Baut panjang',
          satuan_terkecil: 'dus',
          harga: 40000,
          jenis_barang: 'FAST_MOVING',
          batas_fast_moving: 30,
          stok_barang: 0,
        },
      ])
    })
}
