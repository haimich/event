"use strict";

module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('user', {
    firstname: DataTypes.STRING,
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    externalId: {
      type: DataTypes.INTEGER,
      field: 'external_id'
    },
    email: {
      type: DataTypes.STRING,
      validate: { isEmail: true }
    },
    createdAt: {
      type: DataTypes.DATE,
      field: 'created_at',
      defaultValue: DataTypes.NOW
    },
    modifiedAt: {
      type: DataTypes.DATE,
      field: 'modified_at',
      defaultValue: DataTypes.NOW
    }
  }, {
    freezeTableName: true, // Model tableName will be the same as the model name
    updatedAt: 'modifiedAt'
  });

  return User;
};
