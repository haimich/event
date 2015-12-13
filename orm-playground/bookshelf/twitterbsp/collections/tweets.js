var Bookshelf = require('bookshelf').DB;

var Tweet = require('../models/tweet');

module.exports = Bookshelf.Collection.extend({
	model: Tweet
});