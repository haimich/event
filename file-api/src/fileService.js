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

// function getFileById(fileId, dbPool, callback) {
//   fileRepo.getFileById(fileId, dbPool, callback);
// }
// 
function getFileById(fileId, dbPool, callback) {
  callback(null, {  
    id: 4,
    url: null,
    mime_type: 'video/x-f4v',
    filesystem_location: '/home/juicebox/Code/event/file-api/uploads/campus.f4v'
  });
}

exports.getFileById =getFileById; 
exports.createFile = createFile;