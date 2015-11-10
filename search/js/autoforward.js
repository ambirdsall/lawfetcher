  /*\
  |*|  CONTENTS
  |*|
  |*|  1) Variable and function definitions
  |*|  2) Check for valid autoforwarding preference
  |*|  3) Autoforwarding logic for valid preferences
  |*|  4) Logic for invalid (i.e. expired) preferences:
  |*|       * substitute the appropriate source name for '{{source}}'
  |*|       * reveal reconfirm/dismiss alert box
  |*|  5) Add event handlers to buttons
  \*/




/**********************************************************************\
   1) Variable and function definitions
\**********************************************************************/

var $                = require('jquery')
, localforage        = require('localforage')
  // 86,400 ms == 86.4 seconds
, EXPIRATION_INTERVAL_MILLISECONDS = 86400
, buttonText         = {
    notSet: 'Always use<br>this source?'
  , isSet: 'Disable<br>Autoforward'
  }
, $reconfirmDialogue = $('#reconfirm-expired-autoforward')

// `isValid()` is a method of the `preferenceSetting` object. However, defining
// it as a property of `preferenceSetting` can cause errors when cloning the
// object for browser storage. Instead, its context is set by calling it with
// `isValid.call(preferenceSetting)`
var isValid = function isValid() {
  // `timeSet` is, unsurprisingly, a time object set when the preference is
  // created, and remains a reference to that moment; `now` is (re)created
  // anew upon page loads with the retrieval of an existing preferenceSetting.
  var now          = new Date()
  , timeDifference = now.getTime() - this.timeSet.getTime()

  return timeDifference < EXPIRATION_INTERVAL_MILLISECONDS
}
var setPreference = function setPreference($button) {
  var sourceName
  , linkId
  , preferenceSetting

  linkId = $button.attr('id')
  // the terminal [0] accesses the matching string, setting `sourceName` to the
  // actual matching service identifier, rather than the match array holding it.
  sourceName = ( linkId.match(/lexis/) || linkId.match(/westlaw/) )[0]
  preferenceSetting = {
    sourceName: sourceName
    // "Set" the past participle
  , timeSet: new Date()
  }

  localforage.setItem('autoforward', preferenceSetting, function(err, preference){
    if ( err ) {
      console.log(err)
    } else {
      $button.html(buttonText.isSet)
             .addClass('btn-warning  js-isPreference')
             .removeClass('btn-default')
    }
  })
}
var unsetPreference = function unsetPreference($button) {
  localforage.removeItem('autoforward', function(err) {
    if ( err ) {
      console.log(err)
    } else {
      $button.html(buttonText.notSet)
             .removeClass('js-isPreference  btn-warning')
             .addClass('btn-default')
    }
  })
}
var displayAlert = function displayAlert($button) {
  var $alert = $('<div class="autoforward__alert alert alert-warning alert-dismissible" role="alert">' +
      '<button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
        'The next time you navigate to a Linkresolver page, you will be ' +
        'automatically forwarded to this service. Even refreshing this page. ' +
        'If you decide to undo this setting at a later date, simply visit ' +
        '<a href="http://www.birdsall.xyz/linkresolver">www.birdsall.xyz/linkresolver</a>.' +
        '</div>');

  $button.parent().parent().after($alert)
}
var removeAlert = function removeAlert() {
  $('.alert').remove()
}


/**********************************************************************\
   2) Check for valid autoforward preference
\**********************************************************************/
localforage.getItem('autoforward', function(err, preference) {
  var linkToPreferredService
  , $linkTitle
  , serviceName
  , $reconfirmTemplate

  if ( err ) {
    console.log(err)

  /**********************************************************************\
      3) Autoforwarding logic for valid preferences
  \**********************************************************************/
  } else if ( preference && isValid.call(preference) ) {
    linkToPreferredService = $('#link--' + preference.sourceName + '__a')
    window.location.href = linkToPreferredService.attr('href')

  /**********************************************************************\
      4) Logic for invalid (i.e. expired) preferences
  \**********************************************************************/
  } else if ( preference ) {

    /********************************************************************\
        * substitute the appropriate source name for '{{source}}'
    \********************************************************************/
    $linkTitle = $('#link--' + preference.sourceName + '__title')
    serviceName = $linkTitle.text()
    $reconfirmTemplate = $('.js-reconfirm__template')

    $reconfirmTemplate.each(function() {
      var $this = $(this)

      $this.text($this.text().replace(/\{\{source\}\}/g, serviceName))
    })

    /********************************************************************\
        * reveal reconfirm/dismiss alert box
    \********************************************************************/
    $reconfirmDialogue.show()
  }
})


/**********************************************************************\
   5) Add event handlers to buttons
\**********************************************************************/
$('.autoforward__btn').click(function(e) {
  var $this = $(this)

  if ( $this.hasClass('js-isPreference') ) {
    unsetPreference($this)
    removeAlert()
  } else {
    setPreference($this)
    displayAlert($this)
  }
})

$('#js-reconfirm-autoforward').click(function(e) {
  var $this = $(this)

  localforage.getItem('autoforward', function(err, preference) {
    if ( err ) {
      console.log(err)
    } else {
      preference.timeSet = new Date()
      localforage.setItem('autoforward', preference, function(err, preference) {
        $reconfirmDialogue.hide()
      })
    }
  })
  // at least visibly, setPreference on the other one
  $('#reconfirm-expired-autoforward').hide()
});

$('#js-delete-autoforward').click(function(e) {
  var $this = $(this)

  unsetPreference($this)
  // at least visibly, setPreference on the other one
  $('#reconfirm-expired-autoforward').hide()
})
