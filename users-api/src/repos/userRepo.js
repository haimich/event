'use strict';

let dbHelper = require('../helpers/db');

module.exports.searchUsers = (term) => {
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

module.exports.getUserById = (id) => {
  if (isNaN(id) === true) {
    throw new Error(id + ' is not a number');
  }
  
  return dbHelper.getInstance()
    .select('*')
    .from('users')
    .where('id', id)
    .limit(1);
}