var userRepoKnex = require('./userRepoKnex');

exports.searchUserId = function (id, dbPool, callback){
	userRepoKnex.searchUserId(id)
    .then((user) => {
      if (user.length === 0) {
        callback('empty');
      } else {
        callback(null, user);
      }
    })
    .catch((err) => callback(err));
}

exports.searchUser = function (name, dbPool, callback){
  userRepoKnex.searchUser(name)
    .then((users) => callback(null, users))
    .catch((err) => callback(err));
}