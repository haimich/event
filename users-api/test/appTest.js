'use strict';

let should = require('chai').should(),
    restHelper = require('./helpers/rest'),
    dbHelper = require('./helpers/db'),
    status = require('http-status');

const TABLE_NAME = 'users';
const testUser = {
  external_id: 123124,
  username: 'eventman',
  firstname: 'Event',
  lastname: 'Man',
  email: 'event@man.com'
};

describe('GET /users', () => {
  
  before((done) => {
    dbHelper.initDb()
      .then((knex) => {
        knex(TABLE_NAME).insert(testUser).then(() => done());
      })
  });
  
  it('should find a user by username', (done) => {
    restHelper.searchUsers(testUser.username)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(testUser.username);
        done();
      });
  });

  it('should find a user by firstname', (done) => {
    restHelper.searchUsers(testUser.firstname)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(testUser.username);
        
        done();
    });
  });

  it('should find a user by name', (done) => {
    restHelper.searchUsers(testUser.lastname)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(testUser.username);
        
        done();
      });
  });
  
  it('should ignore case', (done) => {
    restHelper.searchUsers('eVenT')
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(testUser.username);
        
        done();
      });
  });
  
  
  it('should find partial matches', (done) => {
    restHelper.searchUsers('ev')
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(testUser.username);
        
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
    restHelper.searchUsers(testUser.username)
      .then((response) => {
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].displayname.should.equal(testUser.firstname + ' ' + testUser.lastname);
        
        done();
      });
  })
  
});

describe('GET /users/{id}', () => {
  
  before((done) => {
    dbHelper.initDb()
      .then((knex) => {
        knex(TABLE_NAME).insert(testUser).then(() => done());
      })
  });
  
  it('should return a user by id', (done) => {
    restHelper.getUserId(testUser.userid)
      .then((response) => {
        response.statusCode.should.equal(status.OK);
        response.body.should.exist;
        
        let users = JSON.parse(response.body);
        users.should.have.length(1);
        users[0].username.should.equal(testUser.username);
        
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