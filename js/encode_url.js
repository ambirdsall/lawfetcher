var url        = 'http://birdsall.xyz/linkresolver/search/',
    $          = require('jquery'),
    urlEncode  = window.encodeURIComponent,
    $input     = $('#url-encoder__input'),
    $helpText  = $('#submit--input-validator-text'),
    $results   = $('#results'),
    buildUrl;

validateInput = function validateInput(input) {
  // Whitelisted characters, optionally /as they appear in the regex/:
  //
  //   Spaces
  //   Letters
  //   Numbers
  //   Dashes, /-\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uff0d/
  //   Parentheses
  //   Comma
  //   Period
  //   Colon
  //   Forward slash
  //   Section symbol, /\u00a7/
  //   Paragraph symbol, /\u00b6/
  return /^[ a-zA-Z\d-\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uff0d\(\),\.:\/\u00a7\00b6]*$/.test(input);
};

cleanDoubleSections = function cleanDoubleSections(citation) {
  // if there's a double section, remove what follows the digits
  //   (i.e. for 'SS 123-125' #=> 'S 123'; similar w/ 'SS 123, 125'
  if ( /\u00a7{2}/.test(citation) ) {
    return citation.replace(/\u00a7(\u00a7 ?\d+).+/, '$1');
  } else {
    return citation;
  }
};

buildUrl = function buildUrl(citation) {
  return url + '?citation=' + urlEncode(citation);
};

processForm = function processForm(e) {
  e.preventDefault();
  var citation     = cleanDoubleSections($.trim($input.val())),
      generatedUrl;

  if (!citation.length) { return; }

  if ( validateInput(citation) ) {
    generatedUrl = buildUrl(citation);

    // There may have been a validation error on a prior attempt.
    $input.parent().removeClass('has-error');
    $helpText.hide();

    $('#results--a-tag').html('<a href="' + generatedUrl + '">' + citation + '</a>');
    $('#results--raw-url').val(generatedUrl);
  } else {
    $input.parent().addClass('has-error');
    $helpText.show();
  }
};

// attach `processForm` to either way the button's liable to be triggered
$('#url-encoder__form').submit(processForm);
$('#submit').click(processForm);

// select the entire text on first click, for ease of copy-pasting
$('.js-results--select-all').mouseup(function() {
  $(this).select();
});

$('.js-results--select-all').focus(function(){
  $('.js-results--select-all').mouseup(function(){
    $(this).select(function(){
      $(this).off('mouseup');
    });

    $(this).select();
  });
});
