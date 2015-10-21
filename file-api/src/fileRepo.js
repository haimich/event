var mysql = require('./mysql');

exports.createAttachment = function (fileModel, dbPool, callback) {
 	dbPool.query(
		"INSERT INTO attachment (url, mime_type, created_at, modified_at) VALUES (:url, :mime_type, :created_at, :modified_at)",
		fileModel
	, function(err, rows) {
    callback(err, rows.insertId);
	});
}