'use strict';

class Session {
  constructor(options) {
    this.id = options.id;
    this.title = options.title;
    this.description = options.description;
    this.date = options.date;
    this.speaker_id = options.speaker_id;
    this.start_time = null;
    this.session_type_id = 1;
    this.session_state_id = 1;
    this.created_at = null;  //auto generated by db
    this.modified_at = null; //auto generated by db

    this.files = options.files;
  }
}

module.exports = Session;