const ONE_DAY             = 86400000 // in milliseconds
const EXPIRATION_INTERVAL = 7 * ONE_DAY
const buttonText          = { notSet: 'Always use<br>this source?'
                            , isSet: 'Disable<br>Autoforward'
                            }
const $reconfirmDialogue  = $('#reconfirm-expired-autoforward')

// `isValid()` is a method of the `preferenceSetting` object. However, defining
// it as a property of `preferenceSetting` can cause errors when cloning the
// object for browser storage. Instead, its context is set by calling it with
// `isValid.call(preferenceSetting)`
function isValid() {
  // `timeSet` is, unsurprisingly, a time object set when the preference is
  // created, and remains a reference to that moment; `now` is (re)created
  // anew upon page loads with the retrieval of an existing preferenceSetting.
  const now            = new Date()
  const timeDifference = now.getTime() - this.timeSet.getTime()

  return timeDifference < EXPIRATION_INTERVAL
}

function setPreference($button) {
  const linkId = $button.attr('id')
  // the terminal [0] accesses the matching string, setting `sourceName` to the
  // actual matching service identifier, rather than the match array holding it.
  const sourceName = ( linkId.match(/lexis/) || linkId.match(/westlaw/) )[0]
  const preferenceSetting = { sourceName: sourceName
                            , timeSet: new Date() // "Set" here is a past participle
                            }

  localStorage.setItem('autoforward', preferenceSetting, (err, preference) => {
    if ( err ) {
      console.log(err)
    } else {
      $button.html(buttonText.isSet)
             .addClass('btn-warning  js-isPreference')
             .removeClass('btn-default')
    }
  })
}
function unsetPreference($button) {
  localStorage.removeItem('autoforward', (err) => {
    if ( err ) {
      console.log(err)
    } else {
      $button.html(buttonText.notSet)
             .removeClass('js-isPreference  btn-warning')
             .addClass('btn-default')
    }
  })
}
function displayAlert($button) {
  const $alert = $(`
    <div class="autoforward__alert alert alert-warning alert-dismissible" role="alert">
      <button type="button" class="close" data-dismiss="alert" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </button>

      The next time you navigate to a Linkresolver page, you will be automatically
      forwarded to this service. Even refreshing this page.  If you decide to undo
      this setting at a later date, simply visit <a
      href="https://www.law.cornell.edu/rio">www.law.cornell.edu/rio</a>.
    </div>
    `);

  $button.parent().parent().after($alert)
}
function removeAlert() {
  $('.alert').remove()
}

export function handleAutoforwardPreference() {
  // Handle autoforward preference, if any
  localStorage.getItem('autoforward', (err, preference) => {
    if ( err ) {
      console.log(err)

      // Autoforwarding logic for valid preferences
    } else if ( preference && isValid.call(preference) ) {
      const linkToPreferredService = $(`#link--${preference.sourceName}__a`)
      window.location.href = linkToPreferredService.attr('href')

      // Logic for invalid (i.e. expired) preferences
    } else if ( preference ) {
      // substitute the appropriate source name for {{source}}
      const $linkTitle = $(`#link--${preference.sourceName}__title`)
      const serviceName = $linkTitle.text()
      const $reconfirmTemplate = $('.js-reconfirm__template')

      $reconfirmTemplate.each(function() {
        const $this = $(this)

        $this.text($this.text().replace(/\{\{source\}\}/g, serviceName))
      })

      // reveal reconfirm/dismiss alert box
      $reconfirmDialogue.show()
    }
  })

  // wire up the buttons
  $('.autoforward__btn').click((e) => {
    const $this = $(this)

    if ( $this.hasClass('js-isPreference') ) {
      unsetPreference($this)
      removeAlert()
    } else {
      setPreference($this)
      displayAlert($this)
    }
  })

  $('#js-reconfirm-autoforward').click((e) => {
    const $this = $(this)

    localStorage.getItem('autoforward', (err, preference) => {
      if ( err ) {
        console.log(err)
      } else {
        preference.timeSet = new Date()
        localStorage.setItem('autoforward', preference, (err, preference) => {
          $reconfirmDialogue.hide()
        })
      }
    })
    // at least visibly, setPreference on the other one
    $('#reconfirm-expired-autoforward').hide()
  });

  $('#js-delete-autoforward').click((e) => {
    const $this = $(this)

    unsetPreference($this)
    // at least visibly, setPreference on the other one
    $('#reconfirm-expired-autoforward').hide()
  })
}
