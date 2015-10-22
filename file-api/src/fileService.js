var fileRepo = require('./fileRepo');

function createFile(fileModel, dbPool, callback) {
  fileRepo.createFile(fileModel, dbPool, function (err, id) {
    if (err) {
      callback(err, null);
      return;
    }
    callback(null, id);	
  });
}

function getFileById(fileId, dbPool, callback) {
  fileRepo.getFileById(fileId, dbPool, callback);
}

exports.getFileById =getFileById; 
exports.createFile = createFile;