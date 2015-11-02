var mysql = require('sails-mysql');

var Waterline = require('waterline');
debugger

// Define your collection (aka model)
var User = Waterline.Collection.extend({
	schema: true,
	autoModifiedAt: false,
	autoCreatedAt: false,

  attributes: {

    name: {
      type: 'string'
    },

    firstname: {
      type: 'string'
    },
		
		email: {
      type: 'email'
    },
		
		fullName: function() {
      return this.firstname + ' ' + this.name
    }
  }
});
Waterline.loadCollection(User);

//new User();

// new User({ tableName: 'user', adapters: { mysql: mysql }}, function(err, Model) {

//   // We now have an instantiated collection to execute queries against
//   Model.find()
//   .where({ age: 21 })
//   .limit(10)
//   .exec(function(err, users) {
//     // Now we have an array of users
//   });

// });
