var mysql  = require('mysql');
var config = require('./config').readConfig();

module.exports = function(){
	var pool = mysql.createPool({
		connectionLimit: config.database.connectionLimit,
		host     : config.database.host,
		user     : config.database.user,
		password : config.database.password,
		database : config.database.database,
		debug    : config.database.debug
		});
  
	// change query format from "?" to ":variable" syntax	
	pool.config.connectionConfig.queryFormat = function (query, values) {
		if (!values) return query;
		return query.replace(/\:(\w+)/g, function (txt, key) {
			if (values.hasOwnProperty(key)) {
				return this.escape(values[key]);
			}
			return txt;
		}.bind(this));
	};

	return pool;
} 

