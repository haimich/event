'use strict';

let Chance = require('chance'),
    chance = new Chance();

function createRandomUser(usernameLength) {
  let datetime = chance.date();
  
  return {
    external_id: chance.natural({ max: 10000000 }),
    username: chance.word({ length: usernameLength }),
    firstname: chance.first(),
    lastname: chance.last(),
    email: chance.email(),
    created_at: datetime,
    modified_at: datetime
  }
}

module.exports = {
  createRandomUser
}