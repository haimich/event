var dateHelper = require('./helper/date');

exports.createFile = function (fileModel, dbPool, callback) {
 	dbPool.query(
		"INSERT INTO file (mime_type, filesystem_location, url, created_at, modified_at) VALUES (:mime_type, :filesystem_location, :url, :created_at, :modified_at)",
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

exports.updateFile = function(fileModel, dbPool, callback) {
  fileModel.modified_at = dateHelper.getCurrentDatetime();
  dbPool.query("UPDATE file SET url = :url, mime_type = :mime_type, filesystem_location = :filesystem_location, modified_at = :modified_at WHERE id = :id",
    fileModel, callback);
}