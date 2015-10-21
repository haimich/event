var mysql = require('./mysql');

exports.searchUser = function (name, dbPool, success) {
	var nameWithWildcards = ("%" + name + "%").toUpperCase();
  
	dbPool.query(
		"SELECT *, CONCAT(firstname, ' ', name) AS displayname FROM user WHERE upper(firstname) like :name OR upper(name) like :name OR upper(username) like :name OR upper(concat_ws(' ', firstname, name) like :name)",
		{ name: nameWithWildcards }
	, function(err, rows, fields) {
		if (err) throw err;		
    success(rows);
	});
}

exports.searchUserId = function (name, dbPool, callback) {
  var gotId= name;
  if (isNaN(gotId) == true) {
    callback(gotId);
    return;
  }
  

	dbPool.query(
		"SELECT * FROM user WHERE id= :name;",
		{ name: gotId }
	, function(err, rows) {
    callback(err, rows);
  });
}