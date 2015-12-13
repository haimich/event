// 'use strict';

let Chance = require('chance'),
    chance = new Chance();

const SESSION_STATE_TABLE = 'session_state',
      SESSION_TYPE_TABLE = 'session_type';

exports.seed = (knex, Promise) => {
  return Promise.join(
    // Delete ALL existing entries
    knex(SESSION_STATE_TABLE).del(),
    knex(SESSION_TYPE_TABLE).del(),

    // Insert seed entries
    setupSessionStates(knex),
    setupSessionTypes(knex),
    
    createTestUser(knex) //important for tests
    
    // outputData(knex)
  );
};

// function outputData(knex) {
//   return knex(TABLE_NAME).select().then(results => console.log(results));
// }

// function generateTestData(knex) {
//   let promises = [];
//   for (let i = 0; i < 100; i++) {
//     promises.push(createRandomUser(knex));
//   }
//   return Promise.all(promises);
// }

// function createRandomUser(knex) {
//   let datetime = chance.date();
  
//   let user = {
//     external_id: chance.natural({ max: 100000 }),
//     username: chance.word({ length: 7 }),
//     firstname: chance.first(),
//     lastname: chance.last(),
//     email: chance.email(),
//     created_at: datetime,
//     modified_at: datetime
//   }
  
//   return knex(TABLE_NAME).insert(user);
// }

// function createTestUser(knex) {
//   let datetime = chance.date();
  
//   let user = {
//     external_id: 12345,
//     username: 'eventman',
//     firstname: 'Event',
//     lastname: 'Man',
//     email: 'event@man.de',
//     created_at: datetime,
//     modified_at: datetime
//   }
  
//   return knex(TABLE_NAME).insert(user);
// }