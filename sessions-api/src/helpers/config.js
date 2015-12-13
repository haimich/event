'use strict';

let path = require('path'),
    yml = require('js-yaml'),
    fs = require('fs');

function loadYaml(configLocation) {
  try {
    return yml.safeLoad(fs.readFileSync(configLocation, 'utf8'));
  } catch (e){
    throw new Error('Config could not be loaded from ' + configLocation);
	}
} 

module.exports.loadConfig = (configLocation) => {
  return loadYaml(configLocation);
}

module.exports.loadKeyFromConfig = (configLocation, key) => {
  let config = loadYaml(configLocation);
  return config[key];
}