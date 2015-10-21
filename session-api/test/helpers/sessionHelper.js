var request = require('request');

var baseUrl = 'http://localhost:8080/event/api/session';

function createSession(session, callback) {  
  request({
    url: baseUrl,
    method: 'PUT',
    body: session,
    json: true
  }, function (error, response, body) {
    if (error) { throw error; }
    callback(response);
  });
}

function getSessions(callback) {
  request({
    url: baseUrl,
    method: 'GET'
  }, function (error, response, body) {
    if (error) { throw error; }
    callback(response);
  });
}

exports.createSession = createSession;
exports.getSessions = getSessions;