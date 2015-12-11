'use strict';

let knexOptions = require('../knexfile').development,
    kn = require('knex'),
    knex = kn(knexOptions);

module.exports.searchUsers = (term) => {
  return knex
    .select('*')
    .from('users')
    .where('username', term)
    .orWhere('firstname', term)
    .orWhere('name', term)
    .then((users) => {
      return users.map((user) => {
        user.displayname = user.firstname + ' ' + user.name;
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