var portRegex = /^--(\w+)=(\d+)/;
var proxyPort    = null,
    frontendPort = null,
    userPort     = null,
    sessionPort  = null,
    filePort     = null;

function parseArguments(callback) {
  process.argv.forEach(function (val, index, array) {
    if (index <= 1) return;
    var match = portRegex.exec(val);
    var name = match[1], value = match[2];
  
    switch (name) {
      case 'proxy':
        proxyPort = value;
      case 'frontend':
        frontendPort = value;
      case 'user':
        userPort = value;
      case 'session':
        sessionPort = value;
      case 'file':
        filePort = value;
    }
  });
  
  callback();
}

parseArguments(function() {
  var proxy = require('redbird')({port: proxyPort});

  proxy.register('localhost/event',             'http://localhost:' + frontendPort);
  proxy.register('localhost/event/api/user',    'http://localhost:' + userPort + '/user');
  proxy.register('localhost/event/api/session', 'http://localhost:' + sessionPort + '/session');
  proxy.register('localhost/event/api/file',    'http://localhost:' + filePort + '/file');
});