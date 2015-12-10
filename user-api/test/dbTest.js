'use strict';

let should = require('chai').should(),
    knex   = require('knex');

describe('GET /user', function() {
  
  beforeEach(() => {
    var knex = require('knex')({
      client: 'sqlite3',
      connection: {
        filename: ':memory:'
      }
    });
  });
  
  it('should return a user by username', (done) => {

  });
});