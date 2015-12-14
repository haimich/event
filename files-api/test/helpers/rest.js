'use strict';

let request = require('request-promise');

let baseUrl = 'http://localhost:8080/event/api/files';

module.exports.convertFile = (fileId) => {
  return request({
    url: baseUrl + '/' + fileId + '/convert',
    method: 'PATCH',
    resolveWithFullResponse: true
  });
}

module.exports.getFileId = (fileid) => {
   return request({
    url: baseUrl + '/' + fileid,
    method: 'GET',
    resolveWithFullResponse: true
  });
}