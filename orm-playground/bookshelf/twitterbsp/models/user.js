var Bookshelf = require('bookshelf').DB;
var FollowerUser = require('./followerUser');

module.exports = Bookshelf.Model.extend({
	tableName: 'Users',
	tweets: function() {
		var Tweet = require('./tweet');
		return this.hasMany(Tweet, 'user_id');
	},
	followers: function() {
		return this.belongsToMany(FollowerUser, 'Followers', 'followee', 'follower');
	},
	following: function() {
		return this.belongsToMany(FollowerUser, 'Followers', 'follower', 'followee');
	}
});