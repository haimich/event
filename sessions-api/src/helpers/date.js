var dateFormat = require('dateformat');

module.exports.getCurrentDatetime = () => {
  var now = new Date();
  return dateFormat(now, "isoDateTime");
}
