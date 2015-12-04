var knex = require('knex');

exports.up = function(knex, Promise) {
  return knex.schema.createTable('books', function(table) {
    table.increments('id').primary();
    table.string('name');
  }).createTable('summaries', function(table) {
    table.increments('id').primary();
    table.string('details');
    table.integer('book_id').unique().references('books.id');
  });
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('books')
    .dropTable('summaries');
};
