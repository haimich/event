'use strict';

let args = require('minimist')(process.argv.slice(2)),
    path = require('path');

module.exports.parse = () => {
  let config = args.config;
  let ports = args.ports || args.p;
  
  if (config === undefined) {
    config = path.join(__dirname, '../../config/development.yml');
    console.log('No config file given. Using ' + config);
  }
  
  if (ports === undefined) {
    throw new Error('No ports file given. Use --ports=<ports file location>');
  }
  
  return {
    config,
    ports
  }
}