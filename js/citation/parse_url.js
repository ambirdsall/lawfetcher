const each                 = require(`lodash/each`)
const urlDecode            = require(`../functions/urlHelpers`).urlDecode
const Clipboard            = require(`clipboard`)
const clipboard            = new Clipboard(`.js-clipboard`)
const Source               = require(`../types/source`)
const Citation             = require(`../types/citation`)
const sourceList           = require(`../data/source_list`)

const encodedQuery         = window.location.search.slice(1)
const originalCitation     = urlDecode(encodedQuery)

const $freeSources         = $(`#source-list--free`)
const $subscriptionSources = $(`#source-list--subscription`)
const $title               = $("#title")
const $permalink           = $(`#permalink__text`)
const tooltipText          = `Copy to Clipboard`

// Set up the rest of the page
$title.text(originalCitation)
$permalink.val(window.location.href)

// build links and link elements for every relevant source
each(sourceList, (source) => {
  const currentSource = Source(source)
  const typedCite = Citation.from(originalCitation)

  if ( currentSource.canHandle(typedCite.type) ) {
    insertUrl(currentSource, typedCite)
  } else {
    // <div> containing the link
    source.$anchor.parent().remove()
  }
})

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
$permalink.mouseup(() => $(this).select() )

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
