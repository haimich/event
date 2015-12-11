var mysql  = require('mysql');

var dbPool = null;

//Create Singleton for DB pools
function createPool(config) {
	dbPool = mysql.createPool({
		connectionLimit: config.database.connectionLimit,
		host:            config.database.host,
		user:            config.database.user,
		port:            config.database.port,
		password:        config.database.password,
		database:        config.database.database,
		debug:           config.database.debug
	});
  
	// change query format from "?" to ":variable" syntax	
	dbPool.config.connectionConfig.queryFormat = function (query, values) {
		if (!values) return query;
		return query.replace(/\:(\w+)/g, function (txt, key) {
			if (values.hasOwnProperty(key)) {
				return this.escape(values[key]);
			}
			return txt;
		}.bind(this));
	};
}

module.exports = function getDbPool(config) {
  if (config) {
    return createPool(config);
  } else if (dbPool !== null && dbPool !== undefined) {
    return dbPool;
  } else {
    throw new Error('Can not create db pool: no config given');
  }
};