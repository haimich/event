'use strict';

let should = require('chai').should(),
    knexOptions = require('../../knexfile').testing,
    knexDb   = require('knex');

/**
 * Create a fresh db instance migrated to the latest db scheme
 */
module.exports.initDb = () => {
  let knex = knexDb(knexOptions);
  return knex.migrate.latest()
    .then(() => knex);
}