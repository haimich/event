var should = require('chai').should();
var helper = require('./helpers/userHelper');
var status = require('http-status');
 
// describe('GET /session', function() {
//   it('should return all sessions', function (done) {
//     helper.getSessions(function(statusCode, sessionList) {
//       statusCode.should.equal(status.OK);
//       sessionList.should.exist;
//       
//       var json = JSON.parse(sessionList);
//       json.should.be.a('array');
//       json.should.not.be.empty;
//       done();
//     });
//   });
// });