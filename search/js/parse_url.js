var $         = require('jquery'),
    urlEncode = window.encodeURIComponent,
    present   = $.inArray,
    extend    = $.extend,
    each      = $.each,
    __slice   = Array.prototype.slice;

// Define a new function from fn1 and fn2 equivalent to fn2(fn1)
//
// An optional thisArg is provided in case the new function is being defined on
// an object and needs to be able to reference its properties with `this`:
// without providing it, `this` will refer to the global object.
var after = function after(fn1, fn2, thisArg) {
  thisArg = thisArg || this;

  return function() {
    return fn2.call(thisArg, fn1.apply(thisArg, arguments));
  }
}

// Before they are used, Sources may be extended with one or more methods
// corresponding to a citation type name. These methods MUST take, in order:
//    the source's baseUrl
//    the url-encoded citation
var Source = function(config) {
  extend(this, {
    name:        config.name,
    baseUrl:     config.baseUrl,
    canDeepLink: config.canDeepLink,
    anchor:      config.anchor,
    cannot:      config.cannot
    // By convention, typeSpecificTreatments is an object, each of whose methods
    // is stored under a key that shares its name with a type. If a source is
    // extended with such a method, it uses it to handle that type over the
    // function defined at `Source.prototype.url.urlGetter`.
  }, config.typeSpecificTreatments || {})
}

extend(Source.prototype, {
  url: function(citation) {
    var urlGetter = this[citation.type] || function(cite) {
      var properCitation = (this.canDeepLink
                            ? cite.fullCite
                            : cite.mainCite);

      return this.baseUrl + urlEncode(properCitation)
    };

    return urlGetter.call(this, citation)
  },
  canHandle: function(type) {
    if ( present(type, this.cannot) === -1 ) {
      return true;
    } else {
      return false;
    }
  }
})

var Citation = function(citationText, type) {
  var mainCite,
      jumpCite,
      matchData;

  // mainCitePatterns find matches, perhaps counter-intuitively, against the given
  // type's jump cite; everything before the jump cite is put in a capture group
  // so that the jump cite can be optionally stripped by Sources
  if ( matchData = citationText.match(type.mainCitePattern) ) {
    // the default type checks against two jump cite patterns; it will have one
    // string and 1 undefined as matchData[1] & matchData[2], arbitrarily ordered
    mainCite = matchData[1] || matchData[2];
    jumpCite = citationText.slice(mainCite.length);
  } else { // i.e. if there is no detectable jump cite
    mainCite = citationText;
    jumpCite = "";
  }

  extend(this, {
    type: type.name,
    mainCite: $.trim(mainCite),
    jumpCite: jumpCite,
    fullCite: citationText,
    subtypes: type.subtypes || null
  });
}

// test citation against each type in order, short-circuiting on any match
// once type has been resolved (either as the match or "default"), use
// citationText and type object to build a Citation object.
function detectType(taxonomy, citationText) {
  var len = taxonomy.length,
      i;

  for ( i = 0; i < len; ++i ) {
    if ( citationText.match(taxonomy[i].idPattern) ) {
      return new Citation(citationText, taxonomy[i]);
    }
  }
}

function formatUrl(source, parsedCitation) {
  var p = $("<p></p>")
      url = source.url(parsedCitation);

  source.anchor.attr("href", url)
               .append(p.html(url));
}

// window.location.search returns the query string verbatim, including the
// delimiting '?'. Indeces 0-2 of the query string ('?citation=') are boilerplate
// and provide no useful information, so only indeces 3+ are saved
var encodedQuery = window.location.search.slice(10),
    originalCitation = window.decodeURIComponent(encodedQuery),
    title = $("#title"),
    sources,
    types;

title.text(originalCitation);
document.title = originalCitation;

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

  // allow config objects to apply individual treatments to the return value of url()
  if (source.hasOwnProperty('url')) {
    currentSource.url = after(currentSource.url, source.url, currentSource);
  }

  if ( currentSource.canHandle(typedCite.type) ) {
    // update the link if the source can handle it
    formatUrl(currentSource, typedCite);
  } else {
    // if not, remove the <div> containing the link
    source.anchor.parent().remove();
  }
});

