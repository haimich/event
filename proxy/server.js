var portRegex = /^--(\w+)=(\d+)/;
var proxyPort    = null,
    frontendPort = null,
    userPort     = null,
    sessionPort  = null,
    filePort     = null,
    docPort      = null,
    sharePort      = null;

var hostname = require("os").hostname();

function parseArguments(callack) {
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
      case 'apidocs':
        docPort = value;
      case 'share':
        sharePort = value;
    }
  });
}

function registerRoutes() {
  var proxy = require('redbird')({port: proxyPort});
  
  proxy.register(hostname + '/event',             'http://localhost:' + frontendPort);
  proxy.register(hostname + '/event/api/user',    'http://localhost:' + userPort + '/user');
  proxy.register(hostname + '/event/api/session', 'http://localhost:' + sessionPort + '/session');
  proxy.register(hostname + '/event/api/file',    'http://localhost:' + filePort + '/file');
  proxy.register(hostname + '/event/apidocs',     'http://localhost:' + docPort + '/apidocs');
  proxy.register(hostname + '/event/api/share',   'http://localhost:' + sharePort + '/share');
}

parseArguments();
registerRoutes();