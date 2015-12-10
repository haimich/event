'use strict';

let should = require('chai').should(),
    knexOptions = require('../knexfile').test,
    knexDb   = require('knex');

describe.only('bla foo', function() {
  let knex;
  
  beforeEach((done) => {
    knex = knexDb(knexOptions);
    
    knex.migrate.latest()
      .then(() => {
        return knex.seed.run();
      })
      .then(() => done());
  });
  
  it('should return a user by username', (done) => {
    done();
  });
});