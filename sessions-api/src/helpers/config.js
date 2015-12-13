'use strict';

let path = require('path'),
    yml = require('js-yaml'),
    fs = require('fs');

function loadYaml(yamlFile) {
  return yml.safeLoad(fs.readFileSync(yamlFile, 'utf8'));
} 

function loadConfig(configLocation) {
	try {
		return loadYaml(configLocation);
	} catch (e){
    throw new Error('Config could not be loaded from ' + configLocation);
	}
}

function loadKeyFromConfig(configLocation, key) {
  try {
    let config = loadYaml(configLocation);
    return config[key];
  } catch (err) {
    throw new Error('Config could not be loaded from ' + configLocation);
  }
}

module.exports = {
  loadConfig,
  loadKeyFromConfig
}