var consumeMessage = require('../../modules/message-queue/messageQueue').consumeMessage;
var config = require('./config').readConfig();
var sessionService = require('./sessionService');
var host = config.messageQueue.url + ':' + config.messageQueue.port;

var inProgress = [{
  sessionId: 1,
  numberOfFilesReceived: 2,
  status: 'in progress' // finished | failed
}];

exports.listen = function(dbPool) {
  consumeMessage(config.messageQueue.convertFinishedQueue, host, function(msg) {
    var content = JSON.parse(msg.content);
    console.log('MESSAGE RECEIVED', content);
    
    var originalFileId = content.originalFile.id;
    // get sessionIdByFileId
    sessionService.getSessionIdByFileId(originalFileId, dbPool, function(err, sessionId) {
      if (err !== null){
        console.warn('sessionId not Found')
        return;
      } else {
        inProgress.push(); //Todo
        
        // add files to session_file
        var convertedFiles = content.convertedFiles;  
        for (var i = 0; i < convertedFiles.length;i++){
          convertedFiles[i]
        }        
      }
    });
    

    //* remove originalfile
    //* check if we are finished
    //* => get session object (with files?)
    //* => share
        
  });
}