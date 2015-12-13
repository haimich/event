var userService = require('./src/userService');

var path = require('path')
    , fs = require('fs')
    , knex = require('knex')
    , bookshelf = require('bookshelf')
    , dbFile = path.join(__dirname, 'app.db')
    , db = null; // bookshelf db instance

// init db
db = bookshelf(knex({
    client: 'sqlite3'
    , connection: { filename: dbFile }
}));

// create a schema if no db found
fs.exists(dbFile, function(exists) {
  if (!exists) {
    db.knex.schema.createTable('user', function(table) {
      table.increments()
      table.string('name')
    });
  }
});

// SQLITE
// var knex = require('knex')({
//   client: 'sqlite3',
//   connection: {
//     filename: './mydb.sqlite'
//   }
// });

// MySQL
// var knex = require('knex')({
//   client: 'mysql',
//   connection: {
//     host     : '127.0.0.1',
//     user     : 'root',
//     password : '',
//     database : 'event',
//     charset  : 'utf8'
//   }
// });

var bookshelf = require('bookshelf')(knex);

var User = bookshelf.Model.extend({
  tableName: 'user'
});

new User({name: 'New', lastname: 'User'}).save().then(function(model) {
  console.log(model);
});

// User.where({id: 1}).fetch()
//   .then(function(book) {
//     console.log(JSON.stringify(book));
//   });