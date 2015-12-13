var Sequelize = require('sequelize');

var sequelize = new Sequelize('event', 'event', 'event', {
  host: 'localhost',
  dialect: 'mysql',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },
});

var User = sequelize.define('user', {
  firstname: Sequelize.STRING,
  name: Sequelize.STRING,
  username: Sequelize.STRING,
  externalId: {
    type: Sequelize.INTEGER,
    field: 'external_id'
  },
  email: {
    type: Sequelize.STRING,
    validate: { isEmail: true }
  },
  createdAt: {
    type: Sequelize.DATE,
    field: 'created_at',
    defaultValue: Sequelize.NOW
  },
  modifiedAt: {
    type: Sequelize.DATE,
    field: 'modified_at',
    defaultValue: Sequelize.NOW
  }
}, {
  freezeTableName: true, // Model tableName will be the same as the model name
  updatedAt: 'modifiedAt'
});

User.findById(1).then(function(user) {
  console.log(user.dataValues);
});

// sequelize.sync().then(function() {
//   return User.get({
//     username: 'janedoe',
//     birthday: new Date(1980, 6, 20)
//   });
// }).then(function(jane) {
//   console.log(jane.get({
//     plain: true
//   }))
// });