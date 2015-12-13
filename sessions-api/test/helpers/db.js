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

module.exports.delete = (tableName, id) => {
  let knex = initDb();
  let ids = [].concat(id);
  
  return knex(tableName).whereIn('id', ids).delete();
}