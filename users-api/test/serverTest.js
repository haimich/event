'use strict';

let should = require('chai').should(),
    helper = require('./helpers/userHelper'),
    status = require('http-status');

let userid = 1,
    username = 'eventman',
    firstname = 'Event',
    lastname = 'Man';

describe('GET /users', () => {
  
  it('should return a user by username', (done) => {
    helper.searchUsers(username)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(username);
        done();
      });
  });

  it('should return a user by firstname', (done) => {
    helper.searchUsers(firstname)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(username);
        
        done();
    });
  });

  it('should return a user by name', (done) => {
    helper.searchUsers(lastname)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(username);
        
        done();
      });
  });
  
  it('should ignore case', (done) => {
    helper.searchUsers('eVenT')
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(username);
        
        done();
      });
  });
  
  it('should not return a user that does not exist', (done) => { 
    helper.searchUsers('hansideinemuddaiscool')
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        
        let users = JSON.parse(response.body);
        users.should.have.length(0);
        
        done();
      });
  });
  
  it('should return an additional field named displayname', (done) => {
    helper.searchUsers(username)
      .then((response) => {
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].displayname.should.equal(firstname + ' ' + lastname);
        
        done();
      });
  })
  
});

describe('GET /users/{id}', () => {
  
  it('should return a user by id', (done) => {
    helper.getUserId(userid)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(username);
        
        done();
      });
  });
  
  it('should return 404 when the user can not be found', (done) => {
    helper.getUserId(12312371293)
      .catch((response) => {
        response.statusCode.should.equal(status.NOT_FOUND);
        let errorObj = JSON.parse(response.error);
        errorObj.error.should.exist;
        
        done();
      });
  });
  
  it('should return 412 when no id is given', (done) => {
    helper.getUserId('fooblablupp')
      .catch((response) => {
        response.statusCode.should.equal(status.PRECONDITION_FAILED);
        let errorObj = JSON.parse(response.error);
        errorObj.error.should.exist;
        
        done();
      });
  });
  
});