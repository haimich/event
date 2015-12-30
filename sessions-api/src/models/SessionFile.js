'use strict';

let moment = require('moment');

module.exports = function SessionFile(session_id, file_id, type) {
  this.session_id = session_id;
  this.file_id = file_id;
  this.type = type;
  this.modified_timestamp = moment().valueOf();
  this.state = null; //DEFAULT value
}