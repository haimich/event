var port = process.argv[2];

var proxy = require('redbird')({port: port});

proxy.register('localhost/event',             'http://localhost:3000');
proxy.register('localhost/event/api/user',    'http://localhost:3001/user');
proxy.register('localhost/event/api/session', 'http://localhost:3002/session');
proxy.register('localhost/event/api/file',    'http://localhost:3003/file');
