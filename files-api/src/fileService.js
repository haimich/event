var fileRepo = require('./fileRepo');

exports.createFile = function(fileModel, dbPool, callback) {
  fileRepo.createFile(fileModel, dbPool, function (err, id) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, id);	
  });
}

exports.getFileById = function(fileId, dbPool, callback) {
  fileRepo.getFileById(fileId, dbPool, callback);
}

exports.updateFile = function(fileModel, dbPool, callback) {
  fileRepo.updateFile(fileModel, dbPool, callback);
}