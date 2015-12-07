exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users_2', function(table) {
      table.dropColumn('password');
    }),
    
    knex.schema.table('users_2', function (table) {
      table.string('email');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.table('users_2', function (table) {
      table.string('password');
    }),
    
    knex.schema.table('users_2', function(table) {
      table.dropColumn('email')
    })
  ]);
};