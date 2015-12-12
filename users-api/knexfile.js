module.exports = {
  
  testing: {
    client: 'sqlite3',
    connection: {
      filename: ':memory:'
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
    timezone: 'UTC',
    pool: {
      min: 2,
      max: 10
    },
    seeds: {
      directory: './sql/seeds'
    },
    migrations: {
      directory: './sql/migrations',
      tableName: 'knex_migrations'
    }
  }

};
