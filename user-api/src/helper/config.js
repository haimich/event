'use strict';

let yml = require('js-yaml');
let fs = require('fs');

module.exports.loadConfig = (configLocation) => {
	try {
		return yml.safeLoad(fs.readFileSync(configLocation, 'utf8'));
	} catch (e){
    throw new Error('Config could not be loaded from ' + configLocation);
	}
}