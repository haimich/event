var args = require('minimist')(process.argv.slice(2));
var configHelper = require('./src/helper/config');

var configLocation = args.config || 'config/config.yml';
var config = configHelper.loadConfig(configLocation);

var portsConfigLocation = args.ports;
var ports = configHelper.loadConfig(args.ports);

var proxy = require('redbird')({port: ports.proxy});

proxy.register(config.hostname + '/event',             'http://localhost:' + ports['frontend']);
proxy.register(config.hostname + '/event/api/user',    'http://localhost:' + ports['user-api']    + '/user');
proxy.register(config.hostname + '/event/api/session', 'http://localhost:' + ports['session-api'] + '/session');
proxy.register(config.hostname + '/event/api/file',    'http://localhost:' + ports['file-api']    + '/file');
proxy.register(config.hostname + '/event/apidocs',     'http://localhost:' + ports['apidocs']     + '/apidocs');
proxy.register(config.hostname + '/event/api/share',   'http://localhost:' + ports['share-api']   + '/share');