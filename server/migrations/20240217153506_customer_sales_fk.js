/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('customer', function (table) {
    table
      .integer('sales_id')
      .unsigned()
      .notNullable()
      .references('id')
      .inTable('sales')
      .alter()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('customer', function (table) {
    table.string('sales_id').alter()
  })
}
