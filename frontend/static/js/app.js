$(document).ready(function() {

  // Initialize autocomplete
  $('.autocomplete.speaker')
    .autocomplete({
      source: [{
        url:"/search/user?q=%QUERY%",
        type:'remote'
      }],
      limit: 5,
      minLength: 1,
      titleKey: 'displayName',
      valueKey: 'id',
      getTitle: function(speaker) {
        return speaker.firstname + ' ' + speaker.lastname;
      },
      getValue: function(speaker) {
        return speaker.firstname + ' ' + speaker.lastname;
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