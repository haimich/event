var mysql  = require('mysql');
var config = require('./config').readConfig().database;

exports.createPool = function(){
	var pool = mysql.createPool({
		connectionLimit: config.connectionLimit,
		host:            config.host,
		user:            config.user,
		password:        config.password,
		database:        config.database,
		debug:           config.debug
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

