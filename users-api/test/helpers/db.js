'use strict';

let should = require('chai').should(),
    knexOptions = require('../../knexfile').development,
    knexDb   = require('knex');

function initDb() {
  return knexDb(knexOptions);
}

function insert(tableName, user) {
  let knex = initDb();
  
  return knex(tableName).insert(user);
}

function remove(tableName, id) {
  let knex = initDb();
  
  return knex(tableName).where('id', id).delete();
}

module.exports = {
  insert,
  remove
}