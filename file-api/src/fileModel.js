var dateFormat = require('dateformat');

function File(options) {
  this.id = options.id
  this.url = options.url;
  this.mime_type = options.mime_type;
  this.created_at = getCurrentDatetime();
  this.session_id = options.session_id;
  this.modified_at = this.created_at;
}

function getCurrentDatetime() {
  var now = new Date();
  return dateFormat(now, "isoDateTime");
}

module.exports = File;