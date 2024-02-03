/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
const bcrypt = require('bcrypt')

exports.seed = function (knex) {
  // Deletes ALL existing entries
  return knex('user')
    .del()
    .then(async function () {
      // Hash passwords
      const hashedPassword1 = await bcrypt.hash('admin', 10)
      const hashedPassword2 = await bcrypt.hash('user', 10)

      // Inserts seed entries
      return knex('user').insert([
        { nama: 'admin', password: hashedPassword1, administrator: true },
        { nama: 'user', password: hashedPassword2, administrator: false },
      ])
    })
}
