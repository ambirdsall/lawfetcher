import { each } from 'lodash-es'
import Clipboard from 'clipboard'

import { urlDecode } from '../functions'
import { Source, Citation } from '../types'
import { sources } from '../data'
import { handleAutoforwardPreference } from './autoforward'

const clipboard        = new Clipboard(`.js-clipboard`)
const encodedQuery     = window.location.search.slice(1)
const originalCitation = urlDecode(encodedQuery)
const tooltipText      = 'Copy to Clipboard'

const $freeSources         = $('#source-list--free')
const $subscriptionSources = $('#source-list--subscription')
const $title               = $('#title')
const $permalink           = $('#permalink__text')

// Set up the rest of the page
$title.text(originalCitation)
$permalink.val(window.location.href)

// build links and link elements for every relevant source
each(sources, (source) => {
  const currentSource = Source(source)
  const typedCite = Citation.from(originalCitation)

  if ( currentSource.canHandle(typedCite.type) ) {
    insertUrl(currentSource, typedCite)
  } else {
    // <div> containing the link
    source.$anchor.parent().remove()
  }
})

// if autoforwarding, handle that before setting up a UI you won't use
handleAutoforwardPreference()

// If no free sources can handle (i.e. a wl_database citation), remove that section entirely
if ( $freeSources.find(`.list-group`).children().length === 0 ) {
  // Remove the free sources section
  $freeSources.remove()

  // Subscription being the only sources left, move from right to middle
  $subscriptionSources.addClass(`col-md-offset-3`)
}

// Set up clipboard functionality

// Select the entire text on first click, for ease of manual copy-pasting. This
// is still potentially useful for a user who misses the (quite obvious) copy
// button, and as a fallback for browsers like Safari that do not handle the
// copy button.
$permalink.mouseup(function() { $(this).select() })

if ( document.queryCommandSupported(`copy`) ) {
  // Replace permalink's static "I'm a link!" icon with tooltipped copy button
  $permalink.parent().append($(`
    <span class="input-group-btn">
      <button class="btn btn-default js-clipboard" id="permalink__btn" type="button" data-clipboard-target="#permalink__text">
        <i class="glyphicon glyphicon-copy"></i>
      </button>
    </span>
  `))
  $(`#permalink__icon-wrapper`).remove()

  $(`.js-clipboard`).tooltip({ title: tooltipText })

  clipboard.on(`success`, (e) => {
    const $this = $(e.trigger)

    $this.attr(`data-original-title`, `Copied!`)
         .tooltip(`show`)
         .one(`mouseleave`, fixTooltipTitle)

    function fixTooltipTitle() {
      $this.attr(`data-original-title`, tooltipText)
    }
  })
}

function insertUrl(source, parsedCitation) {
  const $linkCitation = $(`<p class="link__citation"></p>`)
  const $linkUrl      = $(`<p class="link__url"></p>`)
  const url           = source.url(parsedCitation)
  const citationText  = source.canDeepLink(parsedCitation.type)
                        ? parsedCitation.fullCite
                        : parsedCitation.mainCite

  source.$anchor.attr({
      href: url
    , target: `_blank`
    })
    .append($linkCitation.html(citationText))
    .append($linkUrl.html(url))
}
