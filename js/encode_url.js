var url        = 'http://birdsall.xyz/linkresolver/search/',
    $input     = $('#url-encoder__input'),
    $helpText  = $('#submit--input-validator-text'),
    $results   = $('#results'),
    buildUrl;

buildUrl = function buildUrl(e) {
  e.preventDefault();
  var citation     = $.trim($input.val()),
      generatedUrl;

  if (!citation.length) { return; }

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
  if ( /^[ a-zA-Z\d-\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uff0d\(\),\.:\/\u00a7\00b6]*$/.test(citation) ) {
    generatedUrl = url + '?citation=' + window.encodeURIComponent(citation);

    // There may have been a validation error on a prior attempt.
    $input.parent().removeClass('has-error');
    $helpText.hide();

    $('#results--a-tag').val('<a href="' + generatedUrl + '">' + citation + '</a>');
    $('#results--raw-url').val(generatedUrl);
  } else {
    $input.parent().addClass('has-error');
    $helpText.show();
  }
};

// attach `buildUrl` to either way the button's liable to be triggered
$('#url-encoder__form').submit(buildUrl);
$('#submit').click(buildUrl);

// select the entire text on first click, for ease of copy-pasting
// $('.js-results--display').mouseup(function() {
//   $(this).select();
// });

$('.js-results--display').focus(function(){
  $('.js-results--display').mouseup(function(){
    $(this).select(function(){
      $(this).off('mouseup');
    });

    $(this).select();
  });
});
