/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.raw(
    `ALTER TABLE ?? ADD CONSTRAINT check_primary_key_constraint_order CHECK (nomor_faktur <= 99999999);
      ALTER TABLE ?? ADD CONSTRAINT check_primary_key_constraint_order_item CHECK (id <= 99999999);
      ALTER TABLE ?? ADD CONSTRAINT check_primary_key_constraint_retur CHECK (id <= 99999999);
      ALTER TABLE ?? ADD CONSTRAINT check_primary_key_constraint_retur_item CHECK (id <= 99999999);
      ALTER TABLE ?? ADD CONSTRAINT check_primary_key_constraint_receiving CHECK (id <= 99999999);
      ALTER TABLE ?? ADD CONSTRAINT check_primary_key_constraint_receiving_item CHECK (id <= 99999999);
      ALTER TABLE ?? ADD CONSTRAINT check_primary_key_constraint_payment CHECK (id <= 99999999);
      ALTER TABLE ?? ADD CONSTRAINT check_primary_key_constraint_giro CHECK (id <= 99999999);`,
    [
      'order',
      'order_item',
      'retur',
      'retur_item',
      'receiving',
      'receiving_item',
      'payment',
      'giro',
    ]
  )
}

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.raw(
    `ALTER TABLE ?? DROP CONSTRAINT IF EXISTS check_primary_key_constraint_order;
    ALTER TABLE ?? DROP CONSTRAINT IF EXISTS check_primary_key_constraint_order_item;
    ALTER TABLE ?? DROP CONSTRAINT IF EXISTS check_primary_key_constraint_retur;
    ALTER TABLE ?? DROP CONSTRAINT IF EXISTS check_primary_key_constraint_retur_item;
    ALTER TABLE ?? DROP CONSTRAINT IF EXISTS check_primary_key_constraint_receiving;
    ALTER TABLE ?? DROP CONSTRAINT IF EXISTS check_primary_key_constraint_receiving_item;
    ALTER TABLE ?? DROP CONSTRAINT IF EXISTS check_primary_key_constraint_payment;
    ALTER TABLE ?? DROP CONSTRAINT IF EXISTS check_primary_key_constraint_giro;`,
    [
      'order',
      'order_item',
      'retur',
      'retur_item',
      'receiving',
      'receiving_item',
      'payment',
      'giro',
    ]
  )
}
