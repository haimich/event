'use strict';

const SESSIONS = 'sessions';

exports.seed = (knex, Promise) => {
  return Promise.join(
    // Delete ALL existing entries
    knex(SESSIONS).del(),

    // Insert seed entries
    knex(SESSIONS).insert({
      title: 'Test presentation',
      description: 'My test presentation',
      date: '2015-10-23',
      speaker_id: 1,
      session_type_id: 1,
      session_state_id: 1
    })
  );
};