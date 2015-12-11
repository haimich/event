'use strict';

let request = require('request-promise');

let baseUrl = 'http://localhost:8080/event/api/user';

module.exports.searchUser = (userinfo) => {
  return request({
    url: baseUrl + '?filter=' + userinfo,
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