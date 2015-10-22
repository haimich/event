var should = require('chai').should();
var Session = require('../src/sessionModel');

describe('Session', function() {
  it('should create a Session', function() {

  	var options = {
  		id: 0,
      title: 'Title',
      description: 'description',
      date: null,
      speaker_id: 1,
      start_time: null,
      session_type_id: 1,
      session_state_id: 1,
      files: null
  	}
  	var session = new Session(options);

    session.id.should.equal(options.id);
    session.title.should.equal(options.title);
    session.description.should.equal(options.description);
    session.speaker_id.should.equal(options.speaker_id);
    session.session_type_id.should.equal(options.session_type_id);
    session.session_state_id.should.equal(options.session_state_id);
  })
});