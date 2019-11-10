import { difference, head } from 'lodash-es'

import { escapeRegExp } from '../utils'

const urlEncode    = window.encodeURIComponent

export default [
  { name: `Westlaw`//{{{
  , baseUrl: `http://a.next.westlaw.com/Link/Document/FullText?findType=Y&cite=`
  , $anchor: $(`#link--westlaw__a`)
  , _deepLinkableTypes: []
  , _cannot: [ `docket_number` ]
  , _typeSpecificUrls: {//{{{
      _federalRule: function(cite, typeName) {//{{{
        return `${this.baseUrl}${typeName}${cite.ruleNumberAndJumpCite}`
      }//}}}
    , frap: function(cite) {//{{{
        return this._federalRule(cite, `frap%20`)
      }//}}}
    , frcp: function(cite) {//{{{
        return this._federalRule(cite, `frcp%20`)
      }//}}}
    , frcrmp: function(cite) {//{{{
        return this._federalRule(cite, `frcrp%20`)
      }//}}}
    , frbp: function(cite) {//{{{
        return this._federalRule(cite, `frbp%20`)
      }//}}}
    , fre: function(cite) {//{{{
        return this._federalRule(cite, `fre%20`)
      }//}}}
    }//}}}
  }//}}}
, { name: `Lexis`//{{{
  , baseUrl: `http://advance.lexis.com/laapi/search?q=`
  , $anchor: $(`#link--lexis__a`)
  , _deepLinkableTypes: [`*`]
  , _cannot: [ `public_law` ]
  , _typeSpecificUrls: {//{{{
      _federalRule: function(cite, typeName) {//{{{
        return `${this.baseUrl}${typeName}${cite.ruleNumberAndJumpCite}`
      }//}}}
    , frap: function(cite) {//{{{
        return this._federalRule(cite, `frap%20`)
      }//}}}
    , frcp: function(cite) {//{{{
        return this._federalRule(cite, `frcp%20`)
      }//}}}
    , frcrmp: function(cite) {//{{{
        return this._federalRule(cite, `frcrp%20`)
      }//}}}
    , frbp: function(cite) {//{{{
        return this._federalRule(cite, `frbp%20`)
      }//}}}
    , fre: function(cite) {//{{{
        return this._federalRule(cite, `fre%20`)
      }//}}}
    , docket_number: function(cite) {//{{{
        return `${this.baseUrl}"${urlEncode(cite.mainCite)}"`
      }//}}}
    , default: function(cite) {//{{{
        // Chaining `replace` calls isn't logically beautiful, but reads more
        // clearly than constructing a regex for an optional url-encoded space.
        const cleanedCitation = cite.fullCite.replace(`¶ `, ``)
                                             .replace(`¶`, ``)

        return `${this.baseUrl}${urlEncode(cleanedCitation)}`
      }//}}}
    }//}}}
  }//}}}
, { name: `Casetext`//{{{
  , baseUrl: `https://casetext.com/search?q=`
  , $anchor: $(`#link--casetext__a`)
  , _deepLinkableTypes: []
  , _cannot: allBut( `scotus_us_reports`
                   , `federal_case`
                   , `docket_number`
                   , `default`
                   )
  , _typeSpecificUrls: {//{{{
      docket_number: function(cite) { return `${this.baseUrl}"${urlEncode(cite.fullCite)}"` }
    }//}}}
  }//}}}
, { name: `CourtListener`//{{{
  , baseUrl: `https://www.courtlistener.com/`
  , $anchor: $(`#link--courtlistener__a`)
  , _deepLinkableTypes: []
  , _cannot: allBut(`us_constitution`
                   , `scotus_us_reports`
                   , `federal_case`
                   , `docket_number`
                   , `default`
                   )
  , _url: function(cite) { return `${this.baseUrl}?citation=${urlEncode(cite.mainCite)}` }
  , _typeSpecificUrls: {//{{{
      docket_number: function(cite) { return `${this.baseUrl}?docket_number=${urlEncode(cite.rawNumber)}` }
    }//}}}
  }//}}}
, { name: `Ravel`//{{{
  , baseUrl: `http://www.ravellaw.com/search?query=`
  , $anchor: $(`#link--ravel__a`)
  , _deepLinkableTypes: [
      `usc`
    , `frap`
    , `frcp`
    , `frcrmp`
    , `frbp`
    , `fre`
    ]
  , _cannot: [ `uniform_commercial_code`
             , `wl_database`
             , `cfr`
             , `public_law`
             , `statutes_at_large`
             , `federal_register`
             , `scotus_us_reports`
             , `law_journal`
             ]
  , _typeSpecificUrls: {
    usc: function(cite) {//{{{
      return `https://www.ravellaw.com/statutes/us:usc:t${cite.title}/us:usc:t${cite.title}:s${cite.section}?query=${urlEncode(cite.fullCite)}`
    }//}}}
    , docket_number: function(cite) {//{{{
        return `${this.baseUrl}"${urlEncode(cite.mainCite)}"`
      }//}}}
  }
  }//}}}
, { name: `LII`//{{{
  , baseUrl: `https://www.law.cornell.edu`
  , $anchor: $(`#link--lii__a`)
  , _deepLinkableTypes: [`*`]
  , _cannot: allBut( `us_constitution`
                   , `cfr`
                   , `usc`
                   , `uniform_commercial_code`
                   , `frap`
                   , `frcrmp`
                   , `frcp`
                   , `fre`
                   , `frbp`
                   , `scotus_us_reports`
                   )
    // Before they are used, Source objects may be extended with one or more methods
    // corresponding to a citation type name. These methods MUST take, as a
    // single argument, the url-encoded citation.
  , _typeSpecificUrls: {//{{{
      _federalRule: function(typeName, cite) {//{{{
        const text = cite.fullCite
        let jumpCiteMatch
        let jumpCite

        // Properly format jump cite, if present
        if ( jumpCiteMatch = text.match(/(\(.\))/g) ) {
          jumpCite = jumpCiteMatch.join(`_`).replace(/[\(\)]/g, ``)
        }

        return `${this.baseUrl}/rules/${typeName}/rule_${cite.ruleNumber}#rule_${cite.ruleNumber}_${jumpCite}`
      }//}}}
    , us_constitution: function(cite) {//{{{
        let article = ``
        let section = ``

        if ( cite.article ) article = `/article${cite.article}`
        if ( cite.section ) section = `#section${cite.section}`

        return `${this.baseUrl}/constitution${article}${section}`
      }//}}}
    , cfr: function(cite) {//{{{
        let jumpCiteMatch
        let jumpCite = ``

        if ( jumpCiteMatch = cite.jumpCite.match(/(\([^)]{1,4}\))/g) ) {
          jumpCite = `#${jumpCiteMatch.join(`_`).replace(/[\(\)]/g, ``)}`
        }

        return `${this.baseUrl}/cfr/text/${cite.title}/${cite.section}${jumpCite}`
      }//}}}
    , usc: function(cite) {//{{{
        let jumpCiteMatch
        let jumpCite = ``

        if ( jumpCiteMatch = cite.jumpCite.match(/(\([^)]{1,4}\))/g) ) {
          jumpCite = `#${jumpCiteMatch.join(`_`).replace(/[\(\)]/g, ``)}`
        }

        return `${this.baseUrl}/uscode/text/${cite.title}/${cite.section}${jumpCite}`
      }//}}}
    , uniform_commercial_code: function(cite) {//{{{
      return `${this.baseUrl}/ucc/${cite.article}/${cite.article}-${cite.section}`
    }//}}}
    , frap:   function(cite) {//{{{
        return this._federalRule(`frap`, cite)
      }//}}}
    , frcrmp: function(cite) {//{{{
        return this._federalRule(`frcrmp`, cite)
      }//}}}
    , frcp:   function(cite) {//{{{
        return this._federalRule(`frcp`, cite)
      }//}}}
    , fre:    function(cite) {//{{{
        return this._federalRule(`fre`, cite)
      }//}}}
    , frbp:   function(cite) {//{{{
        return this._federalRule(`frbp`, cite)
      }//}}}
    , scotus_us_reports: function(cite) {//{{{
        return `${this.baseUrl}/supremecourt/text/${cite.volume}/${cite.page}`
      }//}}}
    }//}}}
  }//}}}
, { name: `Google Scholar`//{{{
  , baseUrl: `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q=`
  , $anchor: $(`#link--google-scholar__a`)
  , _deepLinkableTypes: [
      `cfr`
    , `usc`
    , `frap`
    , `frcp`
    , `frcrmp`
    , `frbp`
    , `fre`
    ]
  , _cannot: [ `uniform_commercial_code`
             , `public_law`
             , `statutes_at_large`
             , `federal_register`
             , `law_journal`
             , `wl_database`
             ]
  , _url: function(cite) {
      if ( this.canDeepLink(cite.type) ) {
        return `${this.baseUrl}"${urlEncode(cite.fullCite)}"`
      } else {
        return `${this.baseUrl}"${urlEncode(cite.mainCite)}"`
      }
    }
  }//}}}
, { name: `Google Search`//{{{
  , baseUrl: `https://google.com/search?q=`
  , $anchor: $(`#link--google__a`)
  , _deepLinkableTypes: [`*`]
  , _cannot: [ `wl_database` ]
  , _typeSpecificUrls: {//{{{
      docket_number: function(cite) {//{{{
        return `${this.baseUrl}"${urlEncode(cite.mainCite)}"`
      }//}}}
    }//}}}
  }//}}}
, { name: `Justia`//{{{
  , baseUrl: `https://www.justia.com/search?cx=004471346504245195276%3Ajieqepl7s5a&sa=Search+Justia&q=`
  , $anchor: $(`#link--justia__a`)
  , _deepLinkableTypes: []
  , _cannot: [ `federal_register`
             , `public_law`
             , `statutes_at_large`
             , `usc`
             , `law_journal`
             , `wl_database`
             ]
  , _typeSpecificUrls: {//{{{
      cfr: function(cite) {//{{{
        return `http://law.justia.com/cfr/title${cite.title}/${cite.title}cfr${cite.part}_main_02.html`
      }//}}}
    , scotus_us_reports: function(cite) {//{{{
        return `https://supreme.justia.com/cases/federal/us/${cite.volume}/${cite.page}/`
      }//}}}
    , docket_number: function(cite) {//{{{
        return `${this.baseUrl}"${urlEncode(cite.mainCite)}"`
      }//}}}
    }//}}}
  }//}}}
, { name: `Fastcase`//{{{
  , baseUrl: `https://permafrast.herokuapp.com/`
  , $anchor: $(`#link--fastcase__a`)
  , _deepLinkableTypes: [`*`]
  , _cannot: allBut()
  , _typeSpecificUrls: {//{{{
      federal_case: function(cite) {//{{{
        return `${this.baseUrl}${cite.volume}/${cleanReporter(cite.reporter)}/${cite.page}/redirect`

        // Permafrast and/or Fastcase freaks out when the reporter name
        // contains a space (e.g. "f. 3d" will cause a server error while
        // "f.3d" will not)
        function cleanReporter(reporterVolume) {
          return reporterVolume.replace(/ /g, ``)
        }
      }//}}}
    }//}}}
  }//}}}
, { name: `Federal Digital System`//{{{
  , baseUrl: `http://api.fdsys.gov/link`
  , $anchor: $(`#link--fdsys__a`)
  , _deepLinkableTypes: []
  , _cannot: allBut(`federal_register`
                   , `public_law`
                   , `statutes_at_large`
                   )
  , _typeSpecificUrls: {//{{{
      federal_register: function(cite) {//{{{
        return this.baseUrl + `?collection=fr&volume=${cite.volume}&page=${cite.page}`
      }//}}}
    , public_law: function(cite) {//{{{
        return `${this.baseUrl}?collection=plaw&lawtype=public&congress=${cite.congress}&lawnum=${cite.law}`
      }//}}}
    , statutes_at_large: function(cite) {//{{{
        return this.baseUrl + `?collection=statute&volume=${cite.volume}&page=${cite.page}`
      }//}}}
    }//}}}
  }//}}}
, { name: `HeinOnline`//{{{
  , baseUrl: `http://www.heinonline.org/HOL/OneBoxCitation?&collection=journals&base=js&cit_string=`
  , $anchor: $(`#link--hein-online__a`)
  , _deepLinkableTypes: []
  , _cannot: allBut(`law_journal`)
  }//}}}
]

function allBut(...exceptions) {//{{{
  const allCitationTypes = [ `us_constitution`
                           , `cfr`
                           , `usc`
                           , `uniform_commercial_code`
                           , `wl_database`
                           , `public_law`
                           , `statutes_at_large`
                           , `federal_register`
                           , `frap`
                           , `frcrmp`
                           , `frcp`
                           , `fre`
                           , `frbp`
                           , `scotus_us_reports`
                           , `federal_case`
                           , `state_constitution`
                           , `law_journal`
                           , `law_statute_code_rule`
                           , `docket_number`
                           , `default`
                           ]

  return difference(allCitationTypes, exceptions)
}//}}}

// vim:foldmethod=marker:foldlevel=0
