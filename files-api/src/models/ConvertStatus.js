'use strict';

let Enum = require('enum');

let ConvertStatus = new Enum({
  FAILED: 'failed',
  FINISHED: 'finished'
});

module.exports = ConvertStatus;