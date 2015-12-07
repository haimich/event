exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('users_2', function (table) {
      table.bigIncrements('id').primary().unsigned();
      table.integer('external_id');
      table.string('username');
      table.string('firstname');
      table.string('lastname');
      table.string('password');
      table.dateTime('created_at');
      table.dateTime('modified_at');

      /* CREATE FKS */
      // table.bigInteger('AddressId').unsigned().index().inTable('Address').references('id');
    })
  ]);
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('users_2')
  ]);
};