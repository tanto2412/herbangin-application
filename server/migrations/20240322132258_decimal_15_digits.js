/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable('customer', function (table) {
      table.decimal('batas_piutang', 15, 2).notNullable().alter()
    })
    .alterTable('product', function (table) {
      table.decimal('harga', 15, 2).notNullable().alter()
    })
    .alterTable('receiving', function (table) {
      table.decimal('total', 15, 2).notNullable().alter()
    })
    .alterTable('receiving_item', function (table) {
      table.decimal('harga_satuan', 15, 2).notNullable().alter()
      table.decimal('subtotal', 15, 2).notNullable().alter()
    })
    .alterTable('order', function (table) {
      table.decimal('total', 15, 2).notNullable().alter()
    })
    .alterTable('order_item', function (table) {
      table.decimal('harga_satuan', 15, 2).notNullable().alter()
      table.decimal('subtotal', 15, 2).notNullable().alter()
    })
    .alterTable('retur', function (table) {
      table.decimal('total', 15, 2).notNullable().alter()
    })
    .alterTable('retur_item', function (table) {
      table.decimal('harga_satuan', 15, 2).notNullable().alter()
      table.decimal('subtotal', 15, 2).notNullable().alter()
    })
    .alterTable('payment', function (table) {
      table.decimal('jumlah_pembayaran', 15, 2).notNullable().alter()
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable('customer', function (table) {
      table.decimal('batas_piutang', 12, 2).notNullable().alter()
    })
    .alterTable('product', function (table) {
      table.decimal('harga', 12, 2).notNullable().alter()
    })
    .alterTable('receiving', function (table) {
      table.decimal('total', 12, 2).notNullable().alter()
    })
    .alterTable('receiving_item', function (table) {
      table.decimal('harga_satuan', 12, 2).notNullable().alter()
      table.decimal('subtotal', 12, 2).notNullable().alter()
    })
    .alterTable('order', function (table) {
      table.decimal('total', 12, 2).notNullable().alter()
    })
    .alterTable('order_item', function (table) {
      table.decimal('harga_satuan', 12, 2).notNullable().alter()
      table.decimal('subtotal', 12, 2).notNullable().alter()
    })
    .alterTable('retur', function (table) {
      table.decimal('total', 12, 2).notNullable().alter()
    })
    .alterTable('retur_item', function (table) {
      table.decimal('harga_satuan', 12, 2).notNullable().alter()
      table.decimal('subtotal', 12, 2).notNullable().alter()
    })
    .alterTable('payment', function (table) {
      table.decimal('jumlah_pembayaran', 12, 2).notNullable().alter()
    })
}
