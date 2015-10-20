var fileRepo = require('./fileRepo');

exports.createAttachment = function(fileModel, dbPool, success) {
  fileRepo.createAttachment(fileModel, dbPool, success);
}