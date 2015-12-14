'use strict';

let moment = require('moment');

module.exports.getCurrentTimestamp = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}