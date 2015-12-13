
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('users', (table) => {
      table.bigIncrements('id').primary().unsigned();
      table.integer('external_id');
      table.string('username');
      table.string('firstname');
      table.string('lastname');
      table.string('email');
      table.dateTime('created_at');
      table.dateTime('modified_at');
      
      table.index(['id'], 'index_id');
      table.index(['username', 'firstname', 'lastname'], 'index_namefields');
    })
  ]);
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('users')
  ]);
};