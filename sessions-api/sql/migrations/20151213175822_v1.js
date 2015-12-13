
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('session_type', (table) => {
      table.bigIncrements('id').primary().unsigned();
      table.string('name');
      
      table.index(['id'], 'index_id');
    }),
    
    knex.schema.createTable('session_state', (table) => {
      table.bigIncrements('id').primary().unsigned();
      table.string('name');
      
      table.index(['id'], 'index_id');
    })
  ]).then(() => {
    return knex.schema.createTable('sessions', (table) => {
      table.bigIncrements('id').primary().unsigned();
      table.string('title');
      table.string('description');
      
      table.date('date');
      table.time('start_time');
      table.bigInteger('duration').unsigned();
      table.bigInteger('speaker_id').unsigned();
      
      table.bigInteger('session_type_id').unsigned().defaultTo(0).references('id').inTable('session_type');
      table.bigInteger('session_state_id').unsigned().defaultTo(0).references('id').inTable('session_state');
      
      table.dateTime('created_at');
      table.dateTime('modified_at');
      
      table.index(['id'], 'index_id');
    });
  });
};

exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('session_type'),
    knex.schema.dropTable('session_state'),
    knex.schema.dropTable('sessions')
  ]);
};