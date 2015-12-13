var Bookshelf = require('bookshelf').DB;
var User = require('./user');

module.exports = Bookshelf.Model.extend({
	tableName: 'Users'
});