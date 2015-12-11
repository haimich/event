var args = require('minimist')(process.argv.slice(2));

var configHelper = require('./src/helper/config');
var configLocation = args.config || 'config/config.yml';

var config = configHelper.loadConfig(configLocation);

var port = null;
try {
  var portsParam = args.ports || args.p;
  var ports = configHelper.loadConfig(portsParam);
  port = ports['user-api'];  
} catch (err) {
  throw new Error('No ports config given');
}

var dbPool = require('./src/helper/mysql').createPool(config);

var userService = require('./src/userService');

var express = require('express');
var status = require('http-status');
var cors = require('cors');

var app = express();
app.use(cors());

/**
 * Search for users.
 */
app.get('/user', function(request, response) {
	var filter = request.query.filter || '';
  console.log('Filter:', request.query);
  
	userService.searchUser(filter, dbPool, function(err, result){
    if (err) {
      return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    }
		response.json(result);
	});
});

/**
 * Get a specific user.
 */
app.get('/user/:id', function(request, response) {
  var userId = request.params.id;
    
  if (isNaN(userId) == true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No user id given' });
  }
  
  userService.searchUserId(userId, dbPool, function(err, result){
    if (err) {
      if (err === 'empty') {
        return response.status(status.NOT_FOUND).json({ error: `User with id ${userId} not found` }); 
      } else {
        return response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
      }
    }
    response.json(result);
  });
});

app.listen(port);
