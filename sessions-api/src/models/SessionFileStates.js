'use strict';

let Enum = require('enum');

let SessionFileStates = new Enum({
  ERROR: 'error',
  OK: 'ok'
});

module.exports = SessionFileStates;