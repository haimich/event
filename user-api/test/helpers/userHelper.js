var request = require('request');

var baseUrl = 'http://localhost:8080/event/api/user';
var basePath = '/event/api/user?filter=';

function getUser(userinfo, callback) {
   request({
    url: baseUrl,
    path: basePath + userinfo,
    method: 'GET'
  }, function (error, response, body) {
    if (error) { throw error; }
    callback(response);
  });
}

function getUserId(userid, callback) {
   request({
    url: baseUrl + '/' + userid,
    method: 'GET'
  }, function (error, response, body) {
    if (error) { throw error; }
    callback(response);
  });
}

exports.getUser = getUser;
exports.getUserId = getUserId;