/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('receiving_item', function (table) {
    table.decimal('harga_satuan', 12, 2).notNullable().defaultTo(0).alter()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('receiving_item', function (table) {
    table.decimal('harga_satuan', 12, 2).notNullable().alter()
  })
}
