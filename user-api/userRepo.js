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