var urlEncode = window.encodeURIComponent,
    present   = $.inArray,
    extend    = $.extend,
    each      = $.each,
    __slice   = Array.prototype.slice;

function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Define a new function from fn1 and fn2 equivalent to fn2(fn1)
//
// An optional thisArg is provided in case the new function is being defined on
// an object and needs to be able to reference its properties with `this`:
// without such an argument, `this` will refer to the global object.
function after(fn1, fn2, thisArg) {
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
    cannot: ["federal_rule"]
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
    // can make fed*+_rule
    cannot: ["federal_case", "state_constitution", "law_statute_code_rule", "default"],
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

        if ( titleMatch = text.match(/\d+/) ) {
          path += "/" + titleMatch[0];
        }
        if ( sectionMatch = text.match(/\d+\D+(?:sect(?:\.|ion)?|\u00a7)? ?([0-9\.]+)/i) ) {
          path += "/" + sectionMatch[1];
        }
        if ( jumpCiteMatch = text.match(/(\(.\))/g) ) {
          path += "#" + jumpCiteMatch.join("_").replace(/[\(\)]/g, "");
        }

        return this.baseUrl + "/uscode/text" + path;
      },
      federal_rule: function(cite) {
        var text = cite.fullCite,
            subtypes,
            subtypedCite,
            path = "",
            ruleNumberMatch,
            rule,
            jumpCiteMatch;

        subtypes = [
          {
            name: "frap",
            idPattern: /(?:(?:f||fed||federal)\.? ?(?:r||rules?)\.? ?)(?:of )?(?:app||appellate)/i,
            mainCitePattern: /([^(]+)(?:s*(.))+/
          },
          {
            name: "frcp",
            idPattern: /(?:(?:f||fed||federal)\.? ?(?:r||rules?)\.? ?)(?:of )?(?:c||civ||civil)/i,
            mainCitePattern: /([^(]+)(?:s*(.))+/
          },
          {
            name: "frcrmp",
            idPattern: /(?:(?:f||fed||federal)\.? ?(?:r||rules?)\.? ?)(?:of )?(?:cr||crim||criminal)/i,
            mainCitePattern: /([^(]+)(?:s*(.))+/
          },
          {
            name: "fre",
            idPattern: /(?:(?:f||fed||federal)\.? ?(?:r||rules?)\.? ?)(?:of )?(?:e||evid||evidence)/i,
            mainCitePattern: /([^(]+)(?:s*(.))+/
          },
          {
            name: "frbp",
            idPattern: /(?:(?:f||fed||federal)\.? ?(?:r||rules?)\.? ?)(?:of )?(?:bankr||bkrtcy||bankruptcy)/i,
            mainCitePattern: /([^(]+)(?:s*(.))+/
          }
        ]
        // subtypedCite serves an identical role to that of `cite` in other types
        subtypedCite = detectType(subtypes, text);

        if ( ruleNumberMatch = text.match(/\d+(?:\.\d+)?/) ) {
          rule = "/rule_" + ruleNumberMatch[0];
          path += rule;
        }
        if ( jumpCiteMatch = text.match(/(\(.\))/g) ) {
          path += "#" + rule + "_" + jumpCiteMatch.join("_").replace(/[\(\)]/g, "");
        }

        return this.baseUrl + "/rules/" + subtypedCite.type + path;
      }
    }
  },
  {
    name: "Google Scholar",
    baseUrl: 'https://scholar.google.com/scholar?as_sdt=2006&hl=en&q=',
    anchor: $("#link--google-scholar__a"),
    canDeepLink: false,
    cannot: [],
    url: function(defaultUrl) {
      // Uses RegExp constructor to separate out the baseUrl and the citation
      // to allow the baseUrl to be updated without breaking the quotation-mark-
      // wrapping functionality.
      var citeMatcher = new RegExp(escapeRegExp(this.baseUrl) + "(.+)"),
          citationFromDefaultUrl;

      // the terminal [1] selects the capture group (i.e. everything that
      // follows the baseUrl) from the match array.
      citationFromDefaultUrl = defaultUrl.match(citeMatcher)[1]

      return this.baseUrl + '"' + citationFromDefaultUrl + '"';
    }
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

each(sources, function(index, source) {
  var currentSource = new Source(source);
  var parson = detectType(types, originalCitation);

  // allow alteration of url's return value on a Source-by-Source basis
  if (source.hasOwnProperty('url')) {
    currentSource.url = after(currentSource.url, source.url, currentSource);
  }

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

