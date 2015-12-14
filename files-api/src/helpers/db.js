'use strict';

let knexDb = require('knex'),
    instance = null,
    config = null;

module.exports.initialize = (knexConfig) => {
  config = knexConfig;
  config.timezone = config.timezone || 'UTC';
}

module.exports.getInstance = () => {
  if (instance === null) {
    if (config === null) {
      throw new Error('DB not properly initialized, no config given');
    }
    
    instance = knexDb(config);
  }
  
  return instance;
}