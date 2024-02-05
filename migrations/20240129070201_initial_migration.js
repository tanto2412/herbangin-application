/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('user', function (table) {
      table.increments('id').primary()
      table.string('nama').notNullable().unique()
      table.string('password').notNullable()
      table.boolean('administrator').notNullable()
      table.timestamps(true, true)
    })
    .createTable('sales', function (table) {
      table.increments('id').primary()
      table.string('nama').notNullable().unique()
      table.timestamps(true, true)
    })
    .createTable('customer', function (table) {
      table.increments('id').primary()
      table.string('nama_toko').notNullable()
      table.string('sales_id').notNullable()
      table.text('alamat').notNullable()
      table.string('nomor_telepon')
      table.string('nomor_handphone')
      table.string('email').unique()
      table.decimal('batas_piutang', 12, 2).notNullable()
      table.timestamps(true, true)

      table.index(['sales_id'])
    })
    .createTable('product', function (table) {
      table.increments('id').primary()
      table.string('kode_barang').notNullable().unique()
      table.string('nama_barang').notNullable()
      table.string('satuan_terkecil').notNullable()
      table.decimal('harga', 12, 2).notNullable()
      table.string('jenis_barang').notNullable()
      table.integer('batas_fast_moving')
      table.integer('stok_barang').notNullable()
      table.timestamps(true, true)

      table.index(['kode_barang'])
      table.index(['jenis_barang'])
    })
    .createTable('product_history', function (table) {
      table.increments('id').primary()
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('product')
      table.integer('stok_sebelum').notNullable()
      table.integer('stok_sesudah').notNullable()
      table.string('reference_type').notNullable()
      table.integer('reference_id').notNullable()
      table.timestamps(true, true)

      table.index(['product_id'])
      table.index(['reference_type', 'reference_id'])
    })
    .createTable('receiving', function (table) {
      table.increments('id').primary()
      table.bigint('tanggal').notNullable()
      table.decimal('total', 12, 2).notNullable()
      table.timestamps(true, true)
    })
    .createTable('receiving_item', function (table) {
      table.increments('id').primary()
      table
        .integer('receiving_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('receiving')
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('product')
      table.integer('jumlah_barang').notNullable()
      table.string('satuan_terkecil').notNullable()
      table.decimal('harga_satuan', 12, 2).notNullable()
      table.decimal('subtotal', 12, 2).notNullable()
      table.timestamps(true, true)

      table.index(['receiving_id'])
      table.index(['product_id'])
    })
    .createTable('order', function (table) {
      table.increments('nomor_faktur').primary()
      table.bigint('tanggal_faktur').notNullable()
      table
        .integer('customer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('customer')
      table
        .integer('sales_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('sales')
      table.decimal('total', 12, 2).notNullable()
      table.timestamps(true, true)

      table.index(['customer_id'])
      table.index(['sales_id'])
    })
    .createTable('order_item', function (table) {
      table.increments('id').primary()
      table
        .integer('nomor_faktur')
        .unsigned()
        .notNullable()
        .references('nomor_faktur')
        .inTable('order')
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('product')
      table.string('kode_barang').notNullable()
      table.integer('jumlah_barang').notNullable()
      table.string('satuan_terkecil').notNullable()
      table.decimal('harga_satuan', 12, 2).notNullable()
      table.decimal('subtotal', 12, 2).notNullable()
      table.timestamps(true, true)

      table.index(['nomor_faktur'])
      table.index(['product_id'])
      table.index(['kode_barang'])
    })
    .createTable('retur', function (table) {
      table.increments('id').primary()
      table
        .integer('nomor_faktur')
        .unsigned()
        .notNullable()
        .references('nomor_faktur')
        .inTable('order')
      table.bigint('tanggal').notNullable()
      table
        .integer('customer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('customer')
      table
        .integer('sales_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('sales')
      table.decimal('total', 12, 2).notNullable()
      table.timestamps(true, true)

      table.index(['nomor_faktur'])
      table.index(['customer_id'])
      table.index(['sales_id'])
    })
    .createTable('retur_item', function (table) {
      table.increments('id').primary()
      table
        .integer('retur_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('retur')
      table
        .integer('product_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('product')
      table.string('kode_barang').notNullable()
      table.integer('jumlah_barang').notNullable()
      table.string('satuan_terkecil').notNullable()
      table.decimal('harga_satuan', 12, 2).notNullable()
      table.decimal('subtotal', 12, 2).notNullable()
      table.timestamps(true, true)

      table.index(['retur_id'])
      table.index(['product_id'])
      table.index(['kode_barang'])
    })
    .createTable('payment', function (table) {
      table.increments('id').primary()
      table
        .integer('nomor_faktur')
        .unsigned()
        .notNullable()
        .references('nomor_faktur')
        .inTable('order')
      table.bigint('tanggal').notNullable()
      table.decimal('jumlah_pembayaran', 12, 2).notNullable()
      table.string('jenis_pembayaran').notNullable()
      table.string('remarks')
      table.timestamps(true, true)

      table.index(['nomor_faktur'])
      table.index(['jenis_pembayaran'])
    })
    .createTable('giro', function (table) {
      table.increments('id').primary()
      table
        .integer('nomor_faktur')
        .unsigned()
        .notNullable()
        .references('nomor_faktur')
        .inTable('order')
      table
        .integer('nomor_penjualan')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('payment')
      table.string('nomor_giro').notNullable()
      table.bigint('tanggal_jatuh_tempo').notNullable()
      table.bigint('tanggal_pencairan')
      table.string('status_pembayaran').notNullable()
      table.timestamps(true, true)

      table.index(['nomor_faktur'])
      table.index(['nomor_penjualan'])
      table.index(['nomor_giro'])
      table.index(['status_pembayaran'])
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .dropTableIfExists('giro')
    .dropTableIfExists('payment')
    .dropTableIfExists('retur_item')
    .dropTableIfExists('retur')
    .dropTableIfExists('order_item')
    .dropTableIfExists('order')
    .dropTableIfExists('receiving_item')
    .dropTableIfExists('receiving')
    .dropTableIfExists('product_history')
    .dropTableIfExists('product')
    .dropTableIfExists('customer')
    .dropTableIfExists('sales')
    .dropTableIfExists('user')
}
