'use strict';

let args = require('minimist')(process.argv.slice(2));

module.exports.parse = () => {
  let config = args.config;
  let ports = args.ports || args.p;
  
  if (config === undefined) {
    throw new Error('No config file given. Use --config=<config file location>');
  }
  
  if (ports === undefined) {
    throw new Error('No ports file given. Use --ports=<ports file location>');
  }
  
  return {
    config,
    ports
  }
}