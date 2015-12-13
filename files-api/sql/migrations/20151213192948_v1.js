/**
 * Up migration.
 */
exports.up = (knex, Promise) => {
  return Promise.all([
    knex.schema.createTable('files', (table) => {
      table.bigIncrements('id').primary().unsigned();
      table.string('mime_type');
      table.string('filesystem_location');
      table.string('url');
      
      table.dateTime('created_at');
      table.dateTime('modified_at');
      
      table.index(['id'], 'index_id');
    })
  ]);
};

/**
 * Down migration.
 */
exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTable('files')
  ]);
};