/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('retur_item', function (table) {
    table
      .integer('order_item_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('order_item')
      .defaultTo(1)
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('retur_item', function (table) {
    table.dropColumn('order_item_id')
  })
}
