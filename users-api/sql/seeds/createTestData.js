'use strict';

let Chance = require('chance'),
    chance = new Chance();

const TABLE_NAME = 'users';

exports.seed = (knex, Promise) => {
  return Promise.join(
    // Delete ALL existing entries
    knex(TABLE_NAME).del(),

    // Insert seed entries
    generateTestData(knex),
    
    createTestUser(knex) //important for tests
    
    // outputData(knex)
  );
};

function outputData(knex) {
  return knex(TABLE_NAME).select().then(results => console.log(results));
}

function generateTestData(knex) {
  let promises = [];
  for (let i = 0; i < 100; i++) {
    promises.push(createRandomUser(knex));
  }
  return Promise.all(promises);
}

function createRandomUser(knex) {
  let datetime = chance.date();
  
  let user = {
    external_id: chance.natural({ max: 100000 }),
    username: chance.word({ length: 7 }),
    firstname: chance.first(),
    lastname: chance.last(),
    email: chance.email(),
    created_at: datetime,
    modified_at: datetime
  }
  
  return knex(TABLE_NAME).insert(user);
}

function createTestUser(knex) {
  let datetime = chance.date();
  
  let user = {
    external_id: 12345,
    username: 'eventman',
    firstname: 'Event',
    lastname: 'Man',
    email: 'event@man.de',
    created_at: datetime,
    modified_at: datetime
  }
  
  return knex(TABLE_NAME).insert(user);
}