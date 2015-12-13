/**
 * Up migration.
 */
exports.up = (knex, Promise) => {
  return createEnumTables(knex)
    .then(() => {
      return Promise.all([
        knex('session_type').insert({ name: 'presentation' }),
        knex('session_state').insert({ name: 'in progress' }),
        knex('session_state').insert({ name: 'published' }),
        knex('session_state').insert({ name: 'deleted' })
      ]);
    })
    .then(() => createSessionsTable(knex))
    .then(() => createSessionFilesTable(knex));
};

/**
 * Down migration. Order is important due to foreign key constraints.
 */
exports.down = (knex, Promise) => {
  return knex.schema.dropTable('session_files')
    .then(() => {
      return knex.schema.dropTable('sessions');
    })
    .then(() => {
      return Promise.all([
        knex.schema.dropTable('session_type'),
        knex.schema.dropTable('session_state')
      ])
    })
};

function createEnumTables(knex) {
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
  ]);
}

function createSessionsTable(knex) {
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
    
    table.timestamp('created_at').defaultTo(knex.fn.now());;
    table.timestamp('modified_at').defaultTo(knex.fn.now());;
    
    table.index(['id'], 'index_id');
  });
}

function createSessionFilesTable(knex) {
  return knex.schema.createTable('session_files', (table) => {
    table.bigInteger('session_id').unsigned().references('id').inTable('sessions');
    table.bigInteger('file_id').unsigned().references('id').inTable('files');
    
    table.string('type');
    table.string('state');
    
    table.primary(['session_id', 'file_id']);
    table.index(['session_id'], 'index_session_id');
    table.index(['file_id'], 'index_file_id');
  });
}