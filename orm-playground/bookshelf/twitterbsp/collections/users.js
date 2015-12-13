var Bookshelf = require('bookshelf').DB;

var User = require('../models/user');

module.exports = Bookshelf.Collection.extend({
	model: User
});