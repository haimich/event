var userRepo = require('./userRepo');

exports.searchUser = function (name, dbPool, callback){
	userRepo.searchUser(name, dbPool, callback);
}

exports.searchUserId = function (id, dbPool, callback){
	userRepo.searchUserId(id, dbPool, callback);
}