'use strict';

let sqlite3 = require('sqlite3').verbose();
let db;

module.exports.initializeDb = function() {
  db = new sqlite3.Database('event_local.db');
}