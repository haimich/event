var userRepo = require('./userRepo');

exports.searchUser = function (name, callback){
	userRepo.searchUser(name, callback);
}