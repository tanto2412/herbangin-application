/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('sales')
    .del()
    .then(async function () {
      // Inserts seed entries
      return knex('sales').insert([
        {
          nama: 'Nur',
        },
      ])
    })
}
