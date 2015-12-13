'use strict';

/* INIT */

let options = {
  client: 'mysql',
  connection: {
    host     : '127.0.0.1',
    user     : 'event',
    password : 'event',
    database : 'event',
    charset  : 'utf8'
  },
  debug: true
};
let knex = require('knex')(options);
let bookshelf = require('bookshelf')(knex);

process.stderr.on('data', (data) => {
  console.log(data);
});

/* DEFINE MODELS */

let User, Session;

User = bookshelf.Model.extend({
  tableName: 'user',
  id: function() {
    return this.belongsTo(Session);
  }
});

Session = bookshelf.Model.extend({
  tableName: 'session',
  hasTimestamps: true,
  speaker_id: function() {
    return this.hasOne(User);
  }
});

/* DEFINE COLLECTIONS */

let Users = bookshelf.Collection.extend({
  model: User
});

/* CREATE STUFF */

function createUser() {
  let user = {
    external_id: 1234,
    username: 'eventman2',
    firstname: 'Event2',
    name: 'Man2',
    email: 'event.man@1und1.de',
    created_at: new Date(),
    modified_at: new Date()
  }
  
  new User(user).save().then(function(model) {
    console.log('created!', model);
  });
}

/* READ STUFF */

function getAllUsers() {
  User.fetchAll()
    .then((articles) => {
      console.log(articles.toJSON());
    }).catch((error) => {
      console.log(error);
    });
}

function useSql() {
  bookshelf.knex.raw('SELECT * FROM USER').then((rows) => {
    console.log(rows[0]);
  });
}

function getAllUsersCollection() {
  User.collection().fetch() // .collection() creates a User collection with model property set to User
    .then((rows) => {
      console.log(rows.toJSON());
    });
}

function getAllUsersCollectionPredefined() {
  Users.fetch()
    .then((rows) => {
      console.log(rows.toJSON());
    });
}

/* JOIN */

function getSessionWithUser() { 
  return Session.where('title', 'Test presentation').fetch({
      withRelated: ['id'],
      require: true, // throws an error when no response was found
      columns: '*'
    })
}

getSessionWithUser()
  .then((session) => {
    console.log(session.toJSON());
  })
  .catch((err) => {
    console.log('Error', err);
  })
  .finally(function() {
    console.log('Finally!');
    bookshelf.knex.destroy();
  });