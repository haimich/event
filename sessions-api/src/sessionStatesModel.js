var Enum = require('enum');

var SessionStates = new Enum({
  'inProgress': 1,
  'published' : 2,
  'deleted'   : 3
});

module.exports = SessionStates;