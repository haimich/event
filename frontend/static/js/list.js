$(document).ready(function() {

  var sessionTemplate = $('#eventTemplate');

  // Walk through attached files and look for given type
  var getFileByType = function(session, type) {
    for (var i in session.files) {
      var file = session.files[i];
      if (file.type == type) {
        return file;
      }
    }
  };

  // Load list of sessions
  $.get('/event/api/session', function(sessions) {
    $(sessions).each(function(i) {
      var session = sessions[i];
      var screenshot = getFileByType(session, 'screenshot');
      var html = sessionTemplate.clone();
      html.find('.title').text(session.title);
      html.find('.date').text(new Date(session.date).toLocaleDateString());
      html.find('.speaker').text(session.speaker_name);
      html.find('.description').text(session.description);
      if (screenshot != undefined) {
        // html.find('.session-screenshot').css('background-image', 'url(' + screenshot.url + ')');
      }
      html.appendTo('.list-sessions').removeClass('hidden');
    });
  });

}); 
