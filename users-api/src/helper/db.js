'use strict';

let knexDb = require('knex'),
    instance = null;

module.exports.getInstance = (config) => {
  if (instance === null) {
    config.timezone = config.timezone || 'UTC';
    instance = knexDb(config);
  }
  
  return instance;
}