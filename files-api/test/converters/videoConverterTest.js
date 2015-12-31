'use strict';

let should = require('chai').should();
let converter = require('../../src/converters/videoConverter');

describe('getOutputFiles', () => {  
  
  it('should extract mime type and file name from the given string', () => {
    let stdout = `video/mp4=/Users/deinemudda/dev/event/event/files-api/public/2015-12-31-53ff47d0216320def7b3a65180ae22d4.mp4
video/webm=/Users/deinemudda/dev/event/event/files-api/public/2015-12-31-53ff47d0216320def7b3a65180ae22d4.webm`;
    let response = converter.getOutputFiles(stdout);
    response[0].mimetype.should.equal('video/mp4');
    response[0].filesystemLocation.should.equal('/Users/deinemudda/dev/event/event/files-api/public/2015-12-31-53ff47d0216320def7b3a65180ae22d4.mp4');
    response[1].mimetype.should.equal('video/webm');
    response[1].filesystemLocation.should.equal('/Users/deinemudda/dev/event/event/files-api/public/2015-12-31-53ff47d0216320def7b3a65180ae22d4.webm');
  });

});