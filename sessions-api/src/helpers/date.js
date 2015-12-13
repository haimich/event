'use strict';

let dateFormat = require('dateformat');

module.exports.getCurrentDatetime = () => {
  let now = new Date();
  return dateFormat(now, 'yyyy-mm-dd hh:mm:ss');
}
