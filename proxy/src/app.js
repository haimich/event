'use strict';

let configHelper = require('./helpers/config');

let args = require('./helpers/arguments').parse();
let config = configHelper.loadConfig(args.config);
let ports = configHelper.loadConfig(args.ports);
let hostname = config.hostname;

let proxy = require('redbird')({ port: ports['proxy'] });

proxy.register(hostname + '/',                   `http://${hostname}:${ports['proxy']}/event`);
proxy.register(hostname + '/event',              `http://${hostname}:${ports['frontend']}`);
proxy.register(hostname + '/event/api/users',    `http://${hostname}:${ports['users-api']}/users`);
proxy.register(hostname + '/event/api/sessions', `http://${hostname}:${ports['sessions-api']}/sessions`);
proxy.register(hostname + '/event/api/files',    `http://${hostname}:${ports['files-api']}/files`);
proxy.register(hostname + '/event/apidocs',      `http://${hostname}:${ports['apidocs']}/apidocs`);
proxy.register(hostname + '/event/api/share',    `http://${hostname}:${ports['share-api']}/share`);