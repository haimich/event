var mysql  = require('mysql');

exports.createPool = function(config){
	var pool = mysql.createPool({
		connectionLimit: config.database.connectionLimit,
		host:            config.database.host,
		user:            config.database.user,
		port:            config.database.port,
		password:        config.database.password,
		database:        config.database.database,
		debug:           config.database.debug
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

