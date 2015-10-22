var mysql = require('./mysql');

exports.createFile = function (fileModel, dbPool, callback) {
 	dbPool.query(
		"INSERT INTO file (url, mime_type, created_at, modified_at) VALUES (:url, :mime_type, :created_at, :modified_at)",
		fileModel
	, function(err, rows) {
    callback(err, rows.insertId);
	});
}

exports.getFileById = function (id, dbPool, callback) {
  if (isNaN(id)) {
    callback('The given id field ' + id + ' is not a number');
    return;
  }
  id = Number(id);
  
  dbPool.query("SELECT * FROM file WHERE id = :id", { id: id }, function(err, rows) {
    if (err !== null) {
      callback(err);
    } else if (rows.length !== 1) {
      callback('Select by id returned more than one result');
    } else {
      callback(err, rows[0]);      
    }
  });
}
