var dateHelper = require('./helper/date');

function File(options) {
  this.id = options.id
  this.url = options.url;
  this.mime_type = options.mime_type;
  this.filesystem_location = options.filesystem_location;
  this.created_at = dateHelper.getCurrentDatetime();
  this.modified_at = this.created_at;
}

module.exports = File;