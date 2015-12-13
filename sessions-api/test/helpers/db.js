'use strict';

let should = require('chai').should(),
    knexOptions = require('../../knexfile').development,
    knexDb   = require('knex');

function initDb() {
  return knexDb(knexOptions);
}

module.exports.insert = (tableName, user) => {
  let knex = initDb();
  
  return knex(tableName).insert(user);
}

module.exports.remove = (tableName, id) => {
  let knex = initDb();
  
  return knex(tableName).where('id', id).delete();
}