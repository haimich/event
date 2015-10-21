var mysql = require('./mysql');

exports.createAttachment = function (fileModel, dbPool, success) {
 	dbPool.query(
		"INSERT INTO attachment (url, mime_type, created_at, modified_at) VALUES (:url, :mime_type, :created_at, :modified_at)",
		fileModel
	, function(err, rows) {
		if (err) throw err;
    success(rows.insertId);
	});
}