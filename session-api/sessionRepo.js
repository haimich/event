var mysql = require('./mysql');

exports.searchUser = function (name, dbPool, callback) {
	var nameWithWildcards = ("%" + name + "%").toUpperCase();
  
	dbPool.query(
		"SELECT * FROM user WHERE upper(firstname) like :name OR upper(name) like :name OR upper(username) like :name OR upper(concat_ws(' ', firstname, name) like :name)",
		{ name: nameWithWildcards }
	, function(err, rows, fields) {
		if (err) throw err;		
    callback(rows);
	});
}