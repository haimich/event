var should = require('chai').should();
var helper = require('./helpers/fileHelper');
var status = require('http-status');

describe('PATCH /session/{id}/convert', function() {
  it('should convert the given file', function (done) {
    var fileId = 1;
    
    helper.convertFile(fileId, function(response) {
      response.statusCode.should.equal(status.ACCEPTED);
      done();
    });
  });
  
  it('should return an error when no id is given', function (done) {
    var fileId = null;
    
    helper.convertFile(fileId, function(response) {
      response.statusCode.should.equal(status.PRECONDITION_FAILED);
      
      done();
    });
  });
});


describe('GET /file/{id}', function() {
  it('should return a file by id', function (done) {
    var fileId = 1;

    helper.getFileId(fileId, function(response) {
      response.statusCode.should.equal(status.OK);
      response.body.should.exist;
      response.body.should.contain(fileId);
      done();
    });
  });

  it('should return an error when no id is given', function (done) {
    var fileId = null;
    
    helper.getFileId(fileId, function(response) {
      response.statusCode.should.equal(status.PRECONDITION_FAILED);
      
      done();
    });
  });
});