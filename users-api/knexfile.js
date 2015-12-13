'use strict';

let fs = require('fs'),
    path = require('path'),
    yml = require('js-yaml');

const CONFIG_FOLDER = 'config';

module.exports = gatherKnexEnvironments();

/**
 * Fetch all environments from the config folder
 */
function gatherKnexEnvironments() {
  let files = fs.readdirSync(CONFIG_FOLDER),
      knexEnvironments = {};
  
  for (let file of files) {
    if (file.endsWith('.yml') && file !== 'example.yml') {
      let env = file.slice(0, file.length - 4); // remove file ending
      let config = yml.safeLoad(fs.readFileSync(path.join(CONFIG_FOLDER, file)));
      knexEnvironments[env] = config.knex;
    }
  }
  
  return knexEnvironments;
}