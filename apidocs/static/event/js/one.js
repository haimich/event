$(function () {
  initShowHideButton();
  initSwagger();
});

function initSwagger() {
  window.swaggerUi = new SwaggerUi({
    url : "event/event.json",
    dom_id: "swagger-ui-container",
    validatorUrl: null,
    supportedSubmitMethods: ['get', 'post', 'put', 'delete'],
    onComplete: function(swaggerApi, swaggerUi){
      $('pre code').each(function(i, e) {
        hljs.highlightBlock(e)
      });
    },
    onFailure: function(data) {
      log("Unable to Load SwaggerUI");
    },
    docExpansion: "none",
    sorter : "alpha"
  });

  window.swaggerUi.load();

  initModal();
}

function initShowHideButton() {
  $('.one-show-hide').click(function() {
    body = $('.one-body')
    if (body.is(':hidden')) {
      body.slideDown();
      $('.one-show-hide').text('Close introduction')
    } else {
      body.slideUp();
      $('.one-show-hide').text('Read introduction')
    }
  });
}

function initModal() {
  $('#modalLink').click(function() {
    $('#oneModal').foundation('reveal', 'open');
  });
}