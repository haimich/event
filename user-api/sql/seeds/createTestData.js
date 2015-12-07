
exports.seed = function(knex, Promise) {
  return Promise.join(
    // Deletes ALL existing entries
    // knex('users').del(), 

    // Inserts seed entries
    knex('users_2').insert({
      external_id: 1234,
      username: 'eventman',
      firstname: 'Event',
      lastname: 'Man',
      email: 'eventman@1und1.de',
      created_at: '2015-10-20 08:45:00',
      modified_at: '2015-10-20 08:45:00'
    })
    // knex.schema.createTable('users', function (table) {
    //   table.increments();
    //   table.string('name');
    //   table.timestamps();
    // })
  );
};

function createTable(knex) {
  
}