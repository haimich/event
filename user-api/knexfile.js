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
    client: 'mysql',
    debug: true,
    connection: {
      host: 'localhost',
      database: 'event',
      user:     'event',
      password: 'event'
    },
    migrations: {
      directory: './sql/migrations',
      tableName: 'knex_migrations'
    }
  },

  stage: {
    client: 'mysql',
    connection: {
      host: 'localhost',
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
