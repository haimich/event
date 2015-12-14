'use strict';

let dbHelper = require('../helpers/db'),
    dateHelper = require('../helpers/date');

module.exports.createFile = (fileModel) => {
  return dbHelper.getInstance()
    .insert(fileModel)
    .into('files')
    .then((idArray) => idArray[0]);
};

module.exports.getFileById = (id) => {
  let gotId = id;
  if (isNaN(gotId) === true) {
    throw new Error(id + ' is not a number');
  }
  
  let knex = dbHelper.getInstance();
  return knex
    .select('*')
    .from('files')
    .where('id', id)
    .first();
}

exports.updateFile = (fileModel) => {
  //TODO check modified_at
  return dbHelper.getInstance()('files')
    .update({
      url: fileModel.url,
      mime_type: fileModel.mime_type,
      filesystem_location: fileModel.filesystem_location
    })
    .where('id', fileModel.id);
}