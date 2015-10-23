$(document).ready(function() {

  // Set some default values
  var currentUploads = 0;

  // Initialize autocompleter
  $('.autocomplete.speaker').autocomplete({
    serviceUrl: '/event/api/user',
    dataType: 'json',
    paramName: 'find',
    transformResult: function(speakers) {
      var suggestions = [];
      for (var i in speakers) {
        var speaker = speakers[i];
        suggestions.push({
          'value' : speaker.displayname,
          'data'  : speaker.id
        });
      }
      return {suggestions};
    },
    onSelect: function (suggestion) {
      // Set ID in hidden field when suggestion was selected
      var target = $(this).attr('data-hidden-field-id');
      if (target != undefined) {
        $('#' + target).val(suggestion.data);
      }
    }
  });

  // Initialize datepicker
  $('.datepicker')
    .datepicker({
      format: 'dd.mm.yyyy',
      weekStart: 1
    })
    .on('changeDate', function(e) {
      $(e.target).datepicker('hide');
    }
  );
  // Open datepicker on icon click
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
        alert(message);
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
      // case 'sessionVideo':
      //   config.acceptedFiles = 'video/*';
      //   break;
    }

    // Initialize dropzone
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

    // Convert European date
    if (formData.date && formData.date.match(/\d{2}(\.)\d{2}(\.)\d{4}/)) {
      formData.date = formData.date.split('.').reverse().join('-');
    }

    if (formErrors.length > 0) {
      $('#errorMessage').slideDown();
      return;
    }
    
    var files = [];
    if (formData.sessionSlidesId > 0) {
      files.push({ id: formData.sessionSlidesId, type: 'slides' });
    }
    if (formData.sessionScreenshotId > 0) {
      files.push({ id: formData.sessionScreenshotId, type: 'screenshot' });
    }
    if (formData.sessionVideoId > 0) {
      files.push({ id: formData.sessionVideoId, type: 'video' });
    }
    
    var session = {
      title:       formData.title,
      speaker_id:  formData.speakerId,
      description: formData.description,
      date:        formData.date.split('.').reverse().join('-'),
      files:       files
    };

    // Post session object to API
    $.ajax({
      url:  '/event/api/session',
      method: 'put',
      data: JSON.stringify(session),
      contentType: 'application/json'
    }).success(function(data, status, xhr) {
      window.location.replace('/event/index.html');
    }).error(function(xhr, status, error) {
      alert(error);
    });
  });

}); 
