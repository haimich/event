var request = require('request');

function createSession(callback) {
  var postData = {
    title: 'Test title',
    description: 'Test description',
    date: '2015-10-22 15:15:55',
    speaker_id: 1,
    attachments: [1, 2]
  };
  
  request({
    url: 'http://localhost:8080/event/api/session',
    method: 'PUT',
    body: postData,
    json: true
  }, function (error, response, body) {
    if (error) { throw error; }
    callback(response.statusCode);
  });
}

exports.createSession = createSession;