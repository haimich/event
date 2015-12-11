var dateFormat = require('dateformat');

exports.getCurrentDatetime = function() {
  var now = new Date();
  return dateFormat(now, "isoDateTime");
}