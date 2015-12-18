'use strict';

let userService = require('../services/userService')

let path = require('path');
let express = require('express');
let router = express.Router();
let status = require('http-status');

let config = null;

function initialize(conf) {
  config = conf;
}

/**
 * Search for users.
 */
router.get('/users', (request, response) => {
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
router.get('/users/:id', (request, response) => {
  let userId = request.params.id;
  
  if (isNaN(userId) == true) {
    return response.status(status.PRECONDITION_FAILED).json({ error: 'No user id given' });
  }
  
  userService.getUserById(userId)
    .then((user) => {
      if (user === undefined) {
        response.status(status.NOT_FOUND).json({ error: `User with id ${userId} not found` });
      } else {
        response.json(user);
      }
    })
    .catch((err) => {
      response.status(status.INTERNAL_SERVER_ERROR).json({ error: err });
    });
});

module.exports = {
  initialize, router
}