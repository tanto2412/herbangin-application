/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .alterTable('giro', function (table) {
      table.dropColumn('nama_bank')
    })
    .alterTable('payment', function (table) {
      table.string('nama_bank')
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable('giro', function (table) {
      table.string('nama_bank').notNullable()
    })
    .alterTable('payment', function (table) {
      table.dropColumn('nama_bank')
    })
}
