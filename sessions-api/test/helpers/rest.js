'use strict';

let request = require('request-promise');

let baseUrl = 'http://localhost:8080/event/api/sessions';

module.exports.createSession = (session) => {  
  return request({
    url: baseUrl,
    method: 'PUT',
    body: session,
    json: true,
    resolveWithFullResponse: true
  });
}

module.exports.getSessions = () => {
  return request({
    url: baseUrl,
    method: 'GET',
    resolveWithFullResponse: true
  });
}

module.exports.getSessionId = (sessionid) => {
   return request({
    url: baseUrl + '/' + sessionid,
    method: 'GET',
    resolveWithFullResponse: true
  });
}