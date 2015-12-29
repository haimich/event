'use strict';

let Enum = require('enum');

let SessionFileTypes = new Enum({
  SLIDES: 'slides',
  VIDEO: 'video',
  SCREENSHOT: 'screenshot'
});

module.exports = SessionFileTypes;