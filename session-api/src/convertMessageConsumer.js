var consumeMessage = require('../../modules/message-queue/messageQueue').consumeMessage;
var config = require('./config').readConfig();
var sessionService = require('./sessionService');

var inProgress = [];

exports.listen = function(dbPool) {
  var host = config.messageQueue.url + ':' + config.messageQueue.port;
  
  consumeMessage(config.messageQueue.convertFinishedQueue, host, function(msg) {
    var content = JSON.parse(msg.content);
    console.log('MESSAGE RECEIVED', content);
    
    var originalFileId = content.originalFile.id;
    // get sessionIdByFileId
    sessionService.getSessionByFileId(originalFileId, dbPool, function(err, sessionId){
      if (err === null){
        inProgress.push({resessionId : []})
        
        // add files to session_file
        var convertedFiles = content.convertedFiles;  
        for (var i = 0; i < convertedFiles.length;i++){
          convertedFiles[i]
        }
      } else {
        console.warn('sessionId not Found')
        return;
      }
    });
    

    //* remove originalfile
    //* check if we are finished
    //* => get session object
    //* => share
        
  });
}