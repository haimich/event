var userRepo = require('./userRepo');

exports.searchUser = function (name, dbPool, callback){
	userRepo.searchUser(name, dbPool, callback);
}