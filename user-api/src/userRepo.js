'use strict';

let knexOptions = require('../knexfile').development,
    kn = require('knex'),
    knex = kn(knexOptions);

module.exports.searchUser = (name) => {
  return knex
    .select('*')
    .from('user')
    .where('username', name)
    .orWhere('firstname', name)
    .orWhere('name', name)
    .then((users) => {
      return users.map((user) => {
        user.displayname = user.firstname + ' ' + user.name;
        return user;
      });
    });
}

module.exports.searchUserId = (id) => {
  return knex
    .select('*')
    .from('user')
    .where('id', id)
    .limit(1);
}