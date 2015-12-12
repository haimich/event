'use strict';

let path = require('path'),
    yml = require('js-yaml'),
    fs = require('fs');

module.exports.loadConfig = (configLocation) => {
	try {
		return yml.safeLoad(fs.readFileSync(configLocation, 'utf8'));
	} catch (e){
    throw new Error('Config could not be loaded from ' + configLocation);
	}
}

let config = configHelper.loadConfig(configLocation);

let port = null;
try {
  let portsParam = args.ports || args.p;
  let ports = configHelper.loadConfig(portsParam);
  port = ports['users-api'];  
} catch (err) {
  throw new Error('No ports config given');
}