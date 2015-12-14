'use strict';

let fileRepo = require('../repos/fileRepo');

module.exports.createFile = (fileModel) => {
  return fileRepo.createFile(fileModel);
}

module.exports.getFileById = (fileId) => {
  return fileRepo.getFileById(fileId);
}

module.exports.updateFile = (fileModel) => {
  return fileRepo.updateFile(fileModel);
}