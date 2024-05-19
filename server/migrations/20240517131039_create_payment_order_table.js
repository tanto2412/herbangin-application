/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema
    .createTable('payment_group', function (table) {
      table.increments('id').primary()
      table
        .integer('customer_id')
        .unsigned()
        .notNullable()
        .references('id')
        .inTable('customer')
        .defaultTo(1)

      table.index(['customer_id'])
    })
    .then(function () {
      return knex.schema.table('payment', function (table) {
        table
          .integer('payment_group_id')
          .unsigned()
          .references('id')
          .inTable('payment_group')

        table.index(['payment_group_id'])
      })
    })
    .then(function () {
      return knex.raw(
        `INSERT INTO payment_group (customer_id)
        SELECT o.customer_id
        FROM payment
        JOIN "order" o ON o.nomor_faktur = payment.nomor_faktur;

        UPDATE payment
        SET payment_group_id = row_number
        FROM (
            SELECT id, ROW_NUMBER() OVER (ORDER BY id) AS row_number
            FROM payment
        ) AS ranked
        WHERE payment.id = ranked.id;`
      )
    })
    .then(function () {
      return knex.schema.table('payment', function (table) {
        table.integer('payment_group_id').unsigned().notNullable().alter()
      })
    })
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema
    .alterTable('payment', function (table) {
      table.dropColumn('payment_group_id')
    })
    .then(function () {
      return knex.schema.dropTableIfExists('payment_group')
    })
}
