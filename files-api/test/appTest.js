'use strict';

let should = require('chai').should(),
    restHelper = require('./helpers/rest'),
    status = require('http-status');

describe('PATCH /file/{id}/convert', () => {
  
  it('should convert the given file', () => {
    let fileId = 1;
    
    return restHelper.convertFile(fileId)
      .then((response) => {
        response.statusCode.should.equal(status.ACCEPTED);
      });
  });
  
  it('should return an error when no id is given', () => {
    return restHelper.convertFile(null)
      .catch((response) => {
        response.statusCode.should.equal(status.PRECONDITION_FAILED);
      });
  });

});


describe('GET /file/{id}', () => {
  
  it('should return a file by id', () => {
    let fileId = 1;

    return restHelper.getFileId(fileId)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        response.body.should.contain(fileId);
      });
  });

  it('should return an error when no id is given', () => {
    let fileId = null;
    
    return restHelper.getFileId(fileId)
      .then((response) => {
        response.statusCode.should.equal(status.PRECONDITION_FAILED);
      });
  });
  
});
