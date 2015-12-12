'use strict';

let knexOptions = require('../knexfile').development,
    kn = require('knex'),
    knex = kn(knexOptions);

module.exports.searchUsers = (term) => {
  let searchTerm = `%${term}%`;
  
  return knex
    .select('*')
    .from('users')
    .where('username',    'like', `${searchTerm}`)
    .orWhere('firstname', 'like', `${searchTerm}`)
    .orWhere('lastname',  'like', `${searchTerm}`)
    .then((users) => {
      return users.map((user) => {
        user.displayname = user.firstname + ' ' + user.lastname;
        return user;
      });
    });
}

module.exports.getUserById = (id) => {
  return knex
    .select('*')
    .from('users')
    .where('id', id)
    .limit(1);
}