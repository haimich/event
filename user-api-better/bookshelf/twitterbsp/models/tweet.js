var Bookshelf = require('bookshelf').DB;
var User = require('./user');

module.exports = Bookshelf.Model.extend({
	tableName: 'Tweets',
	users: function() {
		return this.belongsTo(User, 'user_id');
	}
});