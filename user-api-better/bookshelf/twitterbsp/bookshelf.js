'use strict';

// taken from https://github.com/kevinlig/node-bookshelfjs-examples

let options = {
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'twitter',
    password : 'twitter',
    database : 'twitter',
    charset  : 'utf8'
  },
  debug: true
};
let knex = require('knex')(options);
let Bookshelf = require('bookshelf');
Bookshelf.DB = Bookshelf(knex);

var Tweets = require('./collections/tweets');
var Users = require('./collections/users');
var Tweet = require('./models/tweet');

function fetchAllTweets() {
  new Tweets().fetch({
      withRelated: ['users']
    }).then(function(collection) {
      console.log(collection.toJSON());
    });
}

function createTweet() {
  new Tweet({
		content: 'the content',
		user_id: 1
	}).save().then(function(postedModel) {
		console.log('Posted Model', postedModel.toJSON());
	});
}

function getTweet() {
  new Tweet({
		id: 2
	}).fetch({
		withRelated: ['users'],
    require: true
	}).then(function(resultingTweet) {
	  console.log(resultingTweet.toJSON());
	});
}

function fetchAllUsers() {
  new Users().fetch({
		withRelated: ['tweets', 'followers', 'following']
	}).then(function(collection) {
		console.log(collection.toJSON());
	});
}

// Bookshelf.DB.knex.destroy();