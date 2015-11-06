var $            = require('jquery'),
    escapeRegExp = require('./utils').escapeRegExp,
    Citation     = require('../types/citation'),
    detectType   = require('../functions/detectType');



module.exports = [
  {
    name: "Westlaw",
    baseUrl: "http://a.next.westlaw.com/Link/Document/FullText?findType=Y&cite=",
    anchor: $("#link--westlaw__a"),
    canDeepLink: false,
    cannot: [],
    typeSpecificTreatments: {
      _federalRule: function(cite, typeName) {
        var text = cite.fullCite,
            ruleNumberMatch,
            ruleNumber;

        if ( ruleNumberMatch = text.match(/\d+ ?(?:\(.\))*/) ) {
          ruleNumber = ruleNumberMatch[0];
        }

        return this.baseUrl + typeName + ruleNumber;
    },
      frap: function(cite) {
        return this._federalRule(cite, 'frap%20');
    },
      frcp: function(cite) {
        return this._federalRule(cite, 'frcp%20');
    },
      frcrmp: function(cite) {
        return this._federalRule(cite, 'frcrp%20');
    },
      frbp: function(cite) {
        return this._federalRule(cite, 'frbp%20');
    },
      fre: function(cite) {
        return this._federalRule(cite, 'fre%20');
      }
    }
  },
  {
    name: "Lexis",
    baseUrl: "http://advance.lexis.com/laapi/search?q=",
    anchor: $("#link--lexis__a"),
    canDeepLink: true,
    cannot: [],
    typeSpecificTreatments: {
      _federalRule: function(cite, typeName) {
        var text = cite.fullCite,
            ruleNumberMatch,
            ruleNumber;

        if ( ruleNumberMatch = text.match(/\d+ ?(?:\(.\))*/) ) {
          ruleNumber = ruleNumberMatch[0];
        }

        return this.baseUrl + typeName + ruleNumber;
    },
      frap: function(cite) {
        return this._federalRule(cite, 'frap%20');
    },
      frcp: function(cite) {
        return this._federalRule(cite, 'frcp%20');
    },
      frcrmp: function(cite) {
        return this._federalRule(cite, 'frcrp%20');
    },
      frbp: function(cite) {
        return this._federalRule(cite, 'frbp%20');
    },
      fre: function(cite) {
        return this._federalRule(cite, 'fre%20');
      }
    }
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
    cannot: ["federal_case", "state_constitution", "law_statute_code_rule", "default"],
    // Before they are used, Source objects may be extended with one or more methods
    // corresponding to a citation type name. These methods MUST take, in order:
    //    the source's baseUrl
    //    the url-encoded citation
    typeSpecificTreatments: {
      _federalRule: function(typeName, cite) {
        var text = cite.fullCite,
            path = "",
            ruleNumberMatch,
            rule,
            jumpCiteMatch;

        // Build link to the proper rule number
        // FIXME Remove conditional? if this assignment ever fails, the link is ruined
        if ( ruleNumberMatch = text.match(/\d+(?:\.\d+)?/) ) {
          rule = 'rule_' + ruleNumberMatch[0];
          path += '/' + rule;
        }
        // And to the proper jump cite, if present
        if ( jumpCiteMatch = text.match(/(\(.\))/g) ) {
          path += "#" + rule + "_" + jumpCiteMatch.join("_").replace(/[\(\)]/g, "");
        }

        return this.baseUrl + "/rules/" + typeName + path;
      },
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
        if ( sectionMatch = text.match(/\d+\D+(?:sect(?:\.|ion)?|\u00a7)? ?([\w\-\.]+)/i) ) {
          path += "/" + sectionMatch[1];
        }
        if ( jumpCiteMatch = text.match(/(\(.\))/g) ) {
          path += "#" + jumpCiteMatch.join("_").replace(/[\(\)]/g, "");
        }

        return this.baseUrl + "/uscode/text" + path;
      },
      frap:   function(cite) {
        return this._federalRule('frap', cite);
      },
      frcrmp: function(cite) {
        return this._federalRule('frcrmp', cite);
      },
      frcp:   function(cite) {
        return this._federalRule('frcp', cite);
      },
      fre:    function(cite) {
        return this._federalRule('fre', cite);
      },
      frbp:   function(cite) {
        return this._federalRule('frbp', cite);
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

