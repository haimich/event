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

      table.timestamp('created_at').defaultTo(knex.fn.now());;
      table.timestamp('modified_at').defaultTo(knex.fn.now());;

      table.index(['id'], 'index_id');
    })
  ]);
};

/**
 * Down migration.
 */
exports.down = (knex, Promise) => {
  return Promise.all([
    knex.schema.dropTableIfExists('files')
  ]);
};