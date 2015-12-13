'use strict';

let knexDb = require('knex'),
    instance = null,
    config = null;

function initialize(knexConfig) {
  config = knexConfig;
  config.timezone = config.timezone || 'UTC';
}

function getInstance() {
  if (instance === null) {
    if (config === null) {
      throw new Error('DB not properly initialized, no config given');
    }
    
    instance = knexDb(config);
  }
  
  return instance;
}

module.exports = {
  initialize,
  getInstance
}