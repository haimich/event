'use strict';

// let should = require('chai').should(),
//     knexOptions = require('../knexfile').development,
//     knexDb   = require('knex');

// const TABLE_NAME = 'users';

// describe('bla foo', function() {
//   let knex = knexDb(knexOptions);
  
//   beforeEach((done) => {
//     knex.migrate.latest()
//       .then(() => {
//         return knex.seed.run();
//       })
//       .then((result) => {
//         done()
//       });
//   });
  
//   it('should return a user by username', (done) => {
//     knex(TABLE_NAME).select()
//       .then((results) => {
//         results.length.should.be(100);
//         done();
//       });
//   });
// });