var should = require('chai').should();
var helper = require('./helpers/fileHelper');
var status = require('http-status');

describe('PATCH /session/{id}/convert', function() {
  it('should convert the given file', function (done) {
    var fileId = 1;
    
    helper.convertFile(fileId, function(response) {
      response.statusCode.should.equal(status.OK);
      done();
    });
  });
});
