'use strict';

let args = require('minimist')(process.argv.slice(2)),
    path = require('path'),
    configHelper = require('./helper/config');

let configLocation = args.config || path.join(__dirname, '../config/config.yml');
let config = configHelper.loadConfig(configLocation);
let hostname = config.hostname;

let ports = null;
try {
  ports = configHelper.loadConfig(args.ports);  
} catch (err) {
  throw new Error('No ports config given');
}

let proxy = require('redbird')({
  port: ports['proxy'],
  xfwd: false
});

proxy.register(hostname + '/',                   `http://${hostname}:${ports['proxy']}/event`);
proxy.register(hostname + '/event',              `http://${hostname}:${ports['frontend']}`);
proxy.register(hostname + '/event/api/users',    `http://${hostname}:${ports['users-api']}/users`);
proxy.register(hostname + '/event/api/sessions', `http://${hostname}:${ports['sessions-api']}/sessions`);
proxy.register(hostname + '/event/api/files',    `http://${hostname}:${ports['files-api']}/files`);
proxy.register(hostname + '/event/apidocs',      `http://${hostname}:${ports['apidocs']}/apidocs`);
proxy.register(hostname + '/event/api/share',    `http://${hostname}:${ports['share-api']}/share`);