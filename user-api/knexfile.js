module.exports = {
  
  test: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
    },
    seeds: {
      directory: './sql/seeds'
    },
    migrations: {
      directory: './sql/migrations',
      tableName: 'knex_migrations'
    }
  },

  development: {
    client: 'sqlite3',
    connection: {
      filename: 'dev.db'
    },
    seeds: {
      directory: './sql/seeds'
    },
    migrations: {
      directory: './sql/migrations',
      tableName: 'knex_migrations'
    }
  },

  stage: {
    client: 'mysql',
    connection: {
      database: 'event',
      user:     'event',
      password: 'event'
    },
    pool: {
      min: 2,
      max: 10
    },
    migrations: {
      directory: './sql/migrations',
      tableName: 'knex_migrations'
    }
  }

};
