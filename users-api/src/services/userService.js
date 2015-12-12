'use strict';

let userRepo = require('../repos/userRepo');

exports.getUserById = (id) => {
	return userRepo.getUserById(id);
}

exports.searchUsers = (term) => {
  return userRepo.searchUsers(term);
}