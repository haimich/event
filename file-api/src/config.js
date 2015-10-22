var yml = require('js-yaml');
var fs = require('fs');

module.exports.readConfig = function() {
	try {
		return yml.safeLoad(fs.readFileSync('config/config.yml', 'utf8'));
	} catch (e){
		throw new Error('Config could not be loaded');
	}
}