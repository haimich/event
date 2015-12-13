'use strict';

let should = require('chai').should(),
    restHelper = require('./helpers/rest'),
    testdataHelper = require('./helpers/testdata'),
    dbHelper = require('./helpers/db'),
    status = require('http-status');

const USERS_TABLE = 'users';

describe('GET /users', () => {
  let randomUser = testdataHelper.createRandomUser(7);
  let userId = null;
  
  before(() => {
    return dbHelper.insert(USERS_TABLE, randomUser)
      .then((response) => {
        userId = response[0];
      });
  });
  
  after(() => {
    return dbHelper.remove(USERS_TABLE, userId);
  });
  
  it('should find a user by username', (done) => {
    restHelper.searchUsers(randomUser.username)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(randomUser.username);
        done();
      });
  });

  it('should find a user by firstname', (done) => {
    restHelper.searchUsers(randomUser.firstname)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(randomUser.username);
        
        done();
    });
  });

  it('should find a user by lastname', (done) => {
    restHelper.searchUsers(randomUser.lastname)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(randomUser.username);
        
        done();
      });
  });
  
  it('should ignore case', (done) => {
    restHelper.searchUsers(randomUser.lastname.toUpperCase())
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(randomUser.username);
        
        done();
      });
  });
  
  
  it('should find partial matches', (done) => {
    restHelper.searchUsers(randomUser.username.slice(0, randomUser.username.length-2))
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(randomUser.username);
        
        done();
      });
  });
  
  it('should not return a user that does not exist', (done) => { 
    restHelper.searchUsers('hansideinemuddaiscool')
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        
        let users = JSON.parse(response.body);
        users.should.have.length(0);
        
        done();
      });
  });
  
  it('should return an additional field named displayname', (done) => {
    restHelper.searchUsers(randomUser.username)
      .then((response) => {
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].displayname.should.equal(randomUser.firstname + ' ' + randomUser.lastname);
        
        done();
      });
  })
  
});

describe('GET /users/{id}', () => {
  
  let randomUser = testdataHelper.createRandomUser(7);
  let userId = null;
  
  before(() => {
    return dbHelper.insert(USERS_TABLE, randomUser)
      .then((response) => {
        userId = response[0];
      });
  });
  
  after(() => {
    return dbHelper.remove(USERS_TABLE, userId);
  });
  
  it('should return a user by id', (done) => {
    restHelper.getUserId(userId)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(randomUser.username);
        
        done();
      });
  });
  
  it('should return 404 when the user can not be found', (done) => {
    restHelper.getUserId(12312371293)
      .catch((response) => {
        response.statusCode.should.equal(status.NOT_FOUND);
        let errorObj = JSON.parse(response.error);
        errorObj.error.should.exist;
        
        done();
      });
  });
  
  it('should return 412 when no valid id is given', (done) => {
    restHelper.getUserId('fooblablupp')
      .catch((response) => {
        response.statusCode.should.equal(status.PRECONDITION_FAILED);
        let errorObj = JSON.parse(response.error);
        errorObj.error.should.exist;
        
        done();
      });
  });
  
});