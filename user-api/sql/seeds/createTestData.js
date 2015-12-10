'use strict';

let Chance = require('chance'),
    chance = new Chance();

const TABLE_NAME = 'users';

exports.seed = (knex, Promise) => {
  return Promise.join(
    // Deletes ALL existing entries
    knex(TABLE_NAME).del(),

    // Inserts seed entries
    generateTestData(knex)
    
    //outputData(knex)
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
  let datetime = chance.date().toISOString();
  
  let user = {
    external_id: chance.natural(),
    username: chance.word(),
    firstname: chance.first(),
    lastname: chance.last(),
    email: chance.email(),
    created_at: datetime,
    modified_at: datetime
  }
  
  return knex(TABLE_NAME).insert(user).then();
}