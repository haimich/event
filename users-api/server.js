'use strict';

let args = require('minimist')(process.argv.slice(2));

let configHelper = require('./src/helper/config');
let configLocation = args.config || 'config/config.yml';

let config = configHelper.loadConfig(configLocation);

let port = null;
try {
  let portsParam = args.ports || args.p;
  let ports = configHelper.loadConfig(portsParam);
  port = ports['users-api'];  
} catch (err) {
  throw new Error('No ports config given');
}

let userService = require('./src/userService');

let express = require('express');
let status = require('http-status');
let cors = require('cors');

let app = express();
app.use(cors());

/**
 * Search for users.
 */
app.get('/users', (request, response) => {
	let filter = request.query.filter || '';
  
	userService.searchUsers(filter)
    .then((users) => {
		  response.json(users);
	  })
    .catch((err) => {
      response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    });
});

/**
 * Get a specific user.
 */
app.get('/users/:id', (request, response) => {
  let userId = request.params.id;
  
  if (isNaN(userId) == true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No user id given' });
  }
  
  userService.getUserById(userId)
    .then((users) => {
      if (users.length === 0) {
        response.status(status.NOT_FOUND).json({ error: `User with id ${userId} not found` });
      } else {
        response.json(users);
      }
    })
    .catch((err) => {
      response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    });
});

app.listen(port);
