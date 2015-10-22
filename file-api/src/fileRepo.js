var mysql = require('./mysql');

exports.createFile = function (fileModel, dbPool, callback) {
 	dbPool.query(
		"INSERT INTO file (url, mime_type, created_at, modified_at) VALUES (:url, :mime_type, :created_at, :modified_at)",
		fileModel
	, function(err, rows) {
    callback(err, rows.insertId);
	});
}

exports.searchFileId = function (name, dbPool, callback) {
  var gotId = name;
  if (isNaN(gotId) == true) {
    callback(gotId);
    return;
  }
  
  dbPool.query("SELECT * FROM file;",
    function(err, rows) {
    callback(err, rows);
  });

  /*
  dbPool.query(
    "SELECT * FROM file WHERE id= :name;",
    { name: gotId }
  , function(err, rows) {
    callback(err, rows);
  });
  */
}
