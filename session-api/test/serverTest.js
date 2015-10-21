var should = require('chai').should();
var http = require('http');

var options = {
  hostname: 'localhost',
  port: 8080,
  path: '/event/api/session',
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

function createSession(err, callback) {
  var postData = JSON.stringify({
    title: 'Test title',
    description: 'Test description',
    date: '2015-10-22 15:15:55',
    speaker_id: 1,
    attachments: [1, 2]
  });
  
  var request = http.request(options, function(response) {
    response.on('end', function() {
      callback(response.statusCode);
    })
  });
  
  request.on('error', function(e) {
    throw(e);
  });
  
  // write data to request body
  request.write(postData);
  request.end();
}

describe('PUT /session', function() {
  it('should create a session', function () {
    createSession(function(statusCode) {
      statusCode.should.equal(201);
    });
  });
});