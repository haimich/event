'use strict';

let moment = require('moment');

module.exports.getTimestamp = () => {
  return moment().format('YYYY-MM-DD HH:mm:ss');
}