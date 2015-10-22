function SessionFile(session_id, file_id, type) {
  this.session_id = session_id;
  this.file_id = file_id;
  this.type = type;
}

module.exports = SessionFile;