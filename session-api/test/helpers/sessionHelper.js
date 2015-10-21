var request = require('request');

var baseUrl = 'http://localhost:8080/event/api/session';

function createSession(callback) {
  var session = {
    title: 'Test title',
    description: 'Test description',
    date: '2015-10-22 15:15:55',
    speaker_id: 1,
    attachments: [1, 2]
  };
  
  request({
    url: baseUrl,
    method: 'PUT',
    body: session,
    json: true
  }, function (error, response, body) {
    if (error) { throw error; }
    callback(response.statusCode, response.body);
  });
}

function getSessions(callback) {
  request({
    url: baseUrl,
    method: 'GET'
  }, function (error, response, body) {
    if (error) { throw error; }
    callback(response.statusCode, response.body);
  });
}

exports.createSession = createSession;
exports.getSessions = getSessions;