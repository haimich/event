'use strict';

let dbHelper = require('../helpers/db');

module.exports.searchUsers = (term) => {
  let searchTerm = `%${term}%`;
  
  let knex = dbHelper.getInstance();
  return knex
    .select('*', knex.raw('CONCAT(users.firstname, " ", users.lastname) AS displayname'))
    .from('users')
    .where('username',    'like', `${searchTerm}`)
    .orWhere('firstname', 'like', `${searchTerm}`)
    .orWhere('lastname',  'like', `${searchTerm}`);
}

module.exports.getUserById = (id) => {
  if (isNaN(id) === true) {
    throw new Error(id + ' is not a number');
  }
  
  return dbHelper.getInstance()
    .select('*')
    .from('users')
    .where('id', id)
    .first();
}