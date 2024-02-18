// knexfile.js
module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'herbangin',
      password: 'herbangin_2024',
      database: 'herbangin_supply',
      charset: 'utf8',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
    seeds: {
      directory: './seeds',
    },
  },
  production: {
    client: 'pg',
    connection: {
      host: 'localhost',
      user: 'herbangin',
      password: 'herbangin_2024',
      database: 'herbangin_supply_prod',
      charset: 'utf8',
    },
    migrations: {
      tableName: 'knex_migrations',
      directory: './migrations',
    },
  },
}
