$(document).ready(function() {

  var sessionTemplate = $('#eventTemplate');

  // Load list of sessions
  $.get('/event/api/session', function(sessions) {
    $(sessions).each(function(i) {
      var session = sessions[i];
      var html = sessionTemplate.clone();
      html.find('.title').text(session.title);
      html.find('.date').text(new Date(session.date).toLocaleDateString());
      html.find('.speaker').text(session.speaker_id);
      html.find('.description').text(session.description);
      html.appendTo('.list-sessions').removeClass('hidden');
    });
  });

}); 
