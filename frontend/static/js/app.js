$(document).ready(function() {

  // Set some default values
  var currentUploads = 0;

  // Initialize autocomplete
  $('.autocomplete.speaker')
    .autocomplete({
      source: [{
        url: '/event/api/user?find=%QUERY%',
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
    .on('selected.xdsoft', function(e, speaker) {
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

  // Disable dropzone auto discover for all elements:
  Dropzone.autoDiscover = false;

  $(".dropzone").each(function() {
    // Global dropzone configuration
    var config = {
      method: 'put',
      maxFiles: 1,
      createImageThumbnails: false,
      previewTemplate: $('#preview-template').html(),
      targetId: $(this).attr('data-id-target'),
      sending: function(file) {
        currentUploads++;
      },
      complete: function(file) {
        currentUploads--;
      },
      success: function(file, response) {
        // Set returned ID into hidden field
        $('input[name=' + this.options.targetId + ']').val(response.id);
      },
      error: function(file, message) {
        alert(message.error);
        this.removeFile(file);
      },
      canceled: function(file) {
        this.removeFile(file);
      }
    };

    // Individual dropzone configuration
    switch ($(this).attr('id')) {
      case 'sessionSlides':
        config.acceptedFiles = 'application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation';
        break;
      case 'sessionScreenshot':
        config.acceptedFiles = 'image/*';
        break;
      case 'sessionVideo':
        config.acceptedFiles = 'video/*';
        break;
    }

    // Initialize  dropzone
    $(this).dropzone(config);
  });

  // Watch save button
  $('.save-session').click(function() {
    // Cancel submit when at least one upload is still in progress
    if (currentUploads > 0) {
      alert(currentUploads + ' upload(s) in progress. Please wait.');
      return;
    }

    // Check form data
    var formData = {};
    var formErrors = [];
    $('.create-session input[name], .create-session textarea[name]').each(function() {
      if (!$(this).hasClass('optional') && $(this).val() == '') {
        $(this).closest('fieldset').addClass('has-error');
        formErrors.push($(this));
      } else {
        $(this).closest('fieldset').removeClass('has-error');
        formData[$(this).attr('name')] = $(this).val();
      }
    });

    if (formErrors.length > 0) {
      return;
    }
    
    var session = {
      title: formData.title,
      speakerId: formData.speakerId,
      description: formData.description,
      date: formData.date,
      slidesId: formData.sessionSlidesId,
      screenshotId: formData.sessionScreenshotId,
      videoId: formData.sessionVideoId
    };

    // TODO: post session object to API
    console.log(session);
  });

}); 
