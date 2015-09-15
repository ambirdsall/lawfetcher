var urlEncode = window.encodeURIComponent,
    present = $.inArray;

// Before they are used, Sources may be extended with one or more methods
// corresponding to a citation type name. These methods MUST take, in order:
//    the source's baseUrl
//    the url-encoded citation
var Source = function(config) {
  $.extend(this, {
    name: config.name,
    baseUrl: config.baseUrl,
    canDeepLink: config.canDeepLink,
    anchor: config.anchor,
    cannot: config.cannot
  }, config.typeSpecificTreatments || {})
}

$.extend(Source.prototype, {
  url: function(citation) {
    var urlGetter = this[citation.type] || function(cite) { // default behavior
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

  // mainCitePatterns match, perhaps counter-intuitively, against the given
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

  $.extend(this, {
    type: type.name,
    mainCite: mainCite,
    jumpCite: jumpCite,
    fullCite: citationText
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
// delimiting '?'. Indeces 0-2 of the query string ('?q=') are boilerplate
// and provide no useful information, so only indeces 3+ are saved
var encodedQuery = window.location.search.slice(3),
    originalCitation = window.decodeURIComponent(encodedQuery),
    title = $("#title"),
    sources,
    types;

// SOURCES: [ Westlaw, Lexis, Ravel, Google Scholar, Google Search, LII ]
// For each source, provide an object with three properties:
//    baseUrl: the entire path up to params for that source's citation search
//    archor: a $(DOM element). They will all have identically formatted IDs.
//    canDeepLink: boolean
sources = [
  {
    name: "Westlaw",
    baseUrl: "http://a.next.westlaw.com/Link/Document/FullText?findType=Y&cite=",
    anchor: $("#link--westlaw__a"),
    canDeepLink: false,
    cannot: []
  },
  {
    name: "Lexis",
    baseUrl: "http://advance.lexis.com/laapi/search?q=",
    anchor: $("#link--lexis__a"),
    canDeepLink: true,
    cannot: []
  },
  {
    name: "Ravel",
    baseUrl: "http://www.ravellaw.com/search?query=",
    anchor: $("#link--ravel__a"),
    canDeepLink: false,
    cannot: []
  },
  {
    name: "Cornell LII",
    baseUrl: "https://www.law.cornell.edu",
    anchor: $("#link--lii__a"),
    canDeepLink: true,
    cannot: ["federal_rule", "federal_case", "state_constitution", "law_statute_code_rule", "default"],
    typeSpecificTreatments: {
      us_constitution: function(cite) {
        var text = cite.mainCite,
            path = "",
            articleMatch,
            sectionMatch;

        if ( articleMatch = text.match(/art(?:\.?|icle) ?([0-9ivxlc]+)/i) ) {
          path += "/article" + articleMatch[1];
        }
        if ( sectionMatch = text.match(/(?:sect(?:\.|ion)?|\u00a7) ?([0-9ivxlc]+)/i) ) {
          path += "#section" + sectionMatch[1];
        }

        return this.baseUrl + "/constitution" + path;
      },
      cfr: function(cite) {
        var text = cite.fullCite,
            path = "",
            titleMatch,
            sectionMatch,
            jumpCiteMatch;

        if ( titleMatch = text.match(/(\d+)/) ) {
          path += "/" + titleMatch[1];
        }
        if ( sectionMatch = text.match(/\d+\D+(?:sect(?:\.|ion)?|\u00a7)? ?([0-9\.]+)/i) ) {
          path += "/" + sectionMatch[1];
        }
        if ( jumpCiteMatch = text.match(/(\(.\))/g) ) {
          path += "#" + jumpCiteMatch.join("_").replace(/[\(\)]/g, "");
        }

        return this.baseUrl + "/cfr/text" + path;
      },
      usc: function(cite) {
        var text = cite.fullCite,
            path = "",
            titleMatch,
            sectionMatch,
            jumpCiteMatch;

        if ( titleMatch = text.match(/(\d+)/) ) {
          path += "/" + titleMatch[1];
        }
        if ( sectionMatch = text.match(/\d+\D+(?:sect(?:\.|ion)?|\u00a7)? ?([0-9\.]+)/i) ) {
          path += "/" + sectionMatch[1];
        }
        if ( jumpCiteMatch = text.match(/(\(.\))/g) ) {
          path += "#" + jumpCiteMatch.join("_").replace(/[\(\)]/g, "");
        }

        return this.baseUrl + "/uscode/text" + path;
      }
      // no others, I believe
    }
  },
  {
    name: "Google Scholar",
    baseUrl: "https://scholar.google.com/scholar?as_sdt=2006&hl=en&q=",
    anchor: $("#link--google-scholar__a"),
    canDeepLink: false,
    cannot: []
  },
  {
    name: "Google Search",
    baseUrl: "http://google.com/search?q=",
    anchor: $("#link--google__a"),
    canDeepLink: true,
    cannot: []
  }
];

// types: [us_constitution, cfr, usc, federal_rule, federal_case, state_constitution, law_statute_code_rule, default]
// for each type, an object with 3 properties:
//   name: snake case string
//   idPattern: regex to 'type' anonymous citations as this
//   mainCitePattern: regex that matches the type's jump cites; and captures
//                    all characters before a jump cite's start
types = [
  {
    name:            "us_constitution",
    idPattern:       /U\.?S\.? Const/i,
    mainCitePattern: /(.+), cl\./
  },
  {
    name:            "cfr",
    idPattern:       /(?:C\.? ?F\.? ?R\.?)/i,
    mainCitePattern: /([^\(]+)(?:\s*\(.\))+/
  },
  {
    name:            "usc",
    idPattern:       /(?:U\.? ?S\.? ?C\.?)/i,
    mainCitePattern: /([^\(]+)(?:\s*\(.\))+/
  },
  {
    name:            "federal_rule",
    idPattern:       /^F(?:(?:ed(?:\.|eral) )|\. ?)?R(?:(?:ules?)|\.?)/,
    mainCitePattern: /([^\(]+)(?:\s*\(.\))+/
  },
  {
    name:            "federal_case",
    idPattern:       /\d{1,5} (?:U\.? ?S\.?|S\. ?Ct\.|F\.(?:Supp\.?)?(?:\dd)?) d{1,5}/i,
    // some federal case citations have, e.g. '(2006)' following jump cite
    // (if present): anything TODO?
    mainCitePattern: /(.+\d{1,5})(?:, ?\d{1,5})/
  },
  {
    name:            "state_constitution",
    idPattern:       /Const/i,
    mainCitePattern: /(.*(?:section|\u00a7) ?[\d\.]+).+/i
  },
  {
    name:            "law_statute_code_rule",
    idPattern:       /(?:laws?)|(?:stat\.?)|(?:code)|(?:regs\.?)|(?:rule)/i,
    mainCitePattern: /([^\(]+)(?:\s*\(.\))+/
  },
  {
    name:            "default",
    idPattern:       /.*/,
    mainCitePattern: /(?:(.+\d+)(?:, ?\d+))|(?:([^\(]+)(?:\s*\(.\))+)/
  },
]

$.each(sources, function(index, source) {
  var currentSource = new Source(source);
  var parson = detectType(types, originalCitation);

  if ( currentSource.canHandle(parson.type) ) {
    // update the link if the source can handle it
    formatUrl(currentSource, parson);
  } else {
    // if not, remove the <div> containing the link
    source.anchor.parent().remove();
  }
});

// Put citation text in h1
title.html(originalCitation); // title.text(originalCitation) ??????

