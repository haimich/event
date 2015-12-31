'use strict';

class ConvertedFile {
  constructor(options) {
    this.mime_type = options.mime_type;
    this.filesystem_location = options.filesystem_location;
  }
}

module.exports = ConvertedFile;