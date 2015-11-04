var $                = require('jquery'),
    extend           = $.extend,
    each             = $.each,
    trim             = $.trim,
    after            = require('./modules/utils').after,
    __slice          = [].slice,
    Source           = require('./types/source'),
    Citation         = require('./types/citation'),
    detectType       = require('./functions/detectType'),
    // window.location.search is the query string, including the '?'.
    // Indeces 0-9 of the query string ('?citation=') are boilerplate.
    encodedQuery     = window.location.search.slice(10),
    originalCitation = window.decodeURIComponent(encodedQuery),
    $title           = $("#title"),
    sources,
    types;

function formatUrl(source, parsedCitation) {
  var p = $("<p></p>");
      url = source.url(parsedCitation);

  source.anchor.attr({
                  href: url,
                  target: '_blank'
                })
               .append(p.html(url));
}

$title.text(originalCitation);

// SOURCES: [ Westlaw, Lexis, Ravel, Google Scholar, Google Search, LII ]
// For each source, provide an object with three properties:
//    baseUrl: the entire path up to params for that source's citation search
//    archor: a $(DOM element). They will all have identically formatted IDs.
//    canDeepLink: boolean
sources = require('./modules/source_list');

// types: [us_constitution, cfr, usc, federal_rule, federal_case, state_constitution, law_statute_code_rule, default]
// for each type, an object with 3 properties:
//   name: snake case string
//   idPattern: regex to 'type' anonymous citations as this
//   mainCitePattern: regex that matches the type's jump cites; and captures
//                    all characters before a jump cite's start
types = require('./modules/type_list');

each(sources, function(index, source) {
  var currentSource = new Source(source);
  var typedCite = detectType(types, originalCitation);

  // allow config objects to decorate the return value of url()
  if (source.hasOwnProperty('url')) {
    currentSource.url = after(currentSource.url, source.url, currentSource);
  }

  if ( currentSource.canHandle(typedCite.type) ) {
    formatUrl(currentSource, typedCite);
  } else {
    // <div> containing the link
    source.anchor.parent().remove();
  }
});

