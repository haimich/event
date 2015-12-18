'use strict';

let configHelper = require('./helpers/config');

let args = require('./helpers/arguments').parse();
let config = configHelper.loadConfig(args.config);
let ports = configHelper.loadConfig(args.ports);
let hostname = config.hostname;

let proxy = require('redbird')({ port: ports['proxy'], bunyan: false });

console.log('Setting up routes:');

register(hostname + '/',                   `http://${hostname}:${ports['proxy']}/event`);
register(hostname + '/event',              `http://${hostname}:${ports['frontend']}`);
register(hostname + '/event/api/users',    `http://${hostname}:${ports['users-api']}/users`);
register(hostname + '/event/api/sessions', `http://${hostname}:${ports['sessions-api']}/sessions`);
register(hostname + '/event/api/files',    `http://${hostname}:${ports['files-api']}/files`);
register(hostname + '/event/apidocs',      `http://${hostname}:${ports['apidocs']}/apidocs`);
register(hostname + '/event/api/share',    `http://${hostname}:${ports['share-api']}/share`);

function register(from, to) {
  console.log(from, ' -> ', to);
  proxy.register(from, to);
}