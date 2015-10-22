var dateFormat = require('dateformat');

function Session(options) {
  this.id = options.id
  this.title = options.title;
  this.description = options.description;
  this.date = options.date;
  this.speaker_id = options.speaker_id;
  this.start_time = null;
  this.session_type_id = 1;
  this.session_state_id = 1;
  this.attachments = options.attachments;
  this.created_at = getCurrentDatetime();
  this.modified_at = this.created_at;
}

function getCurrentDatetime() {
  var now = new Date();
  return dateFormat(now, 'isoDateTime');
}

module.exports = Session;