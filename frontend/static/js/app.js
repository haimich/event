$(document).ready(function() {

  // Initialize autocomplete
  $('.autocomplete.speaker')
    .autocomplete({
      source: [{
        url: 'http://localhost:3001/user?find=%QUERY%',
        type:'remote'
      }],
      limit: 5,
      minLength: 1,
      titleKey: 'displayname',
      valueKey: 'id',
      getTitle: function(speaker) {
        return speaker.firstname + ' ' + speaker.name;
      },
      getValue: function(speaker) {
        return speaker.firstname + ' ' + speaker.name;
      }
    })
    .on('selected.xdsoft',function(e, speaker) {
      // Set ID in hidden field when suggestion was selected
      var target = $(this).attr('data-hidden-field-id');
      if (target != undefined) {
        $('#' + target).val(speaker.id);
      }
    });

  // Initialize datepicker
  $('.datepicker').datepicker({
    format: 'dd.mm.yyyy',
    weekStart: 1
  });
  $('[data-datepicker-id]').click(function() {
    var id= $(this).attr('data-datepicker-id');
    $('#'+id).datepicker('show');
  });
   
});