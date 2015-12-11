var userRepo = require('./userRepo');

exports.searchUserId = (id) => {
	return userRepo.searchUserId(id);
}

exports.searchUser = (name) => {
  return userRepo.searchUser(name);
}