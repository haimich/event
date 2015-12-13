'use strict';

let args = require('minimist')(process.argv.slice(2)),
    path = require('path');

module.exports.parse = () => {
  let ports = args.ports || args.p;
  
  if (ports === undefined) {
    throw new Error('No ports file given. Use --ports=<ports file location>');
  }
  
  return {
    ports
  };
}