'use strict';

let request = require('request-promise');

let baseUrl = 'http://localhost:8080/event/api/users';

module.exports.searchUsers = (term) => {
  return request({
    url: baseUrl + '?filter=' + term,
    method: 'GET',
    resolveWithFullResponse: true
  });
}

module.exports.getUserId = (userid) => {
  return request({
    url: baseUrl + '/' + userid,
    method: 'GET',
    resolveWithFullResponse: true
  });
}

module.exports.callInvalidRoute = () => {
  return request({
    url: baseUrl + '/asdasdajklsdadasdas',
    method: 'GET',
    resolveWithFullResponse: true
  });
}