var request = require('request');

var baseUrl = 'http://localhost:8080/event/api/file';

function convertFile(fileId, callback) {
  request({
    url: baseUrl + '/' + fileId + '/convert',
    method: 'PATCH'
  }, function (error, response, body) {
    if (error) { throw error; }
    callback(response);
  });
}

exports.convertFile = convertFile;