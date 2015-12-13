'use strict';

let dbHelper = require('../helpers/db');

function searchUsers (term) {
  let searchTerm = `%${term}%`;
  
  return dbHelper.getInstance()
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

function getUserById (id) {
  return dbHelper.getInstance()
    .select('*')
    .from('users')
    .where('id', id)
    .limit(1);
}

module.exports = {
  searchUsers,
  getUserById
}