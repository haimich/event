'use strict';

class File {
  constructor(options) {
    this.id = options.id
    this.url = options.url;
    this.mime_type = options.mime_type;
    this.filesystem_location = options.filesystem_location;
  }
}

module.exports = File;