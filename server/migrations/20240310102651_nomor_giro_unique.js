/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.alterTable('giro', function (table) {
    table.string('nomor_giro').notNullable().unique().alter()
  })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.alterTable('giro', function (table) {
    table.dropUnique(['nomor_giro'])
  })
}
