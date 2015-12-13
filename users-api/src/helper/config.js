'use strict';

let path = require('path'),
    yml = require('js-yaml'),
    fs = require('fs');

function loadConfig(configLocation) {
	try {
		return yml.safeLoad(fs.readFileSync(configLocation, 'utf8'));
	} catch (e){
    throw new Error('Config could not be loaded from ' + configLocation);
	}
}

function loadKeyFromConfig(configLocation, key) {
  try {
    let config = yml.safeLoad(fs.readFileSync(configLocation, 'utf8'));
    return config[key];
  } catch (err) {
    throw new Error('Config could not be loaded from ' + configLocation);
  }
}

module.exports = {
  loadConfig, loadKeyFromConfig
}