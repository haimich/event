var yml = require('js-yaml');
var fs = require('fs');

module.exports.readConfigSync = function(configLocation) {
	try {
		return yml.safeLoad(fs.readFileSync(configLocation, 'utf8'));
	} catch (e){
    throw new Error('Config could not be loaded from ' + configLocation);
	}
}