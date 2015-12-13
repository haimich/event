'use strict';

let dateHelper = require('../helpers/date');

module.exports = function Session(options) {
  this.id = options.id;
  this.title = options.title;
  this.description = options.description;
  this.date = options.date;
  this.speaker_id = options.speaker_id;
  this.start_time = null;
  this.session_type_id = 1;
  this.session_state_id = 1;
  this.files = options.files;
  this.created_at = dateHelper.getCurrentDatetime();
  this.modified_at = this.created_at;
}