var request = require('request');

var baseUrl = 'http://localhost:8080/event/api/user';

// function getSessions(callback) {
//   request({
//     url: baseUrl,
//     method: 'GET'
//   }, function (error, response, body) {
//     if (error) { throw error; }
//     callback(response.statusCode, response.body);
//   });
// }
// 
// exports.getSessions = getSessions;