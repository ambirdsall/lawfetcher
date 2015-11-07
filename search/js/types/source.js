var __slice = [].slice
, U         = require('../modules/utils')
, extend    = U.extend
, $         = require('jquery')
, present   = $.inArray
, urlEncode = window.encodeURIComponent



function Source(config) {
  extend(this, {
      name:        config.name
    , baseUrl:     config.baseUrl
    , canDeepLink: config.canDeepLink
    , anchor:      config.anchor
    , cannot:      config.cannot
      // By convention, typeSpecificTreatments is an object, each of whose methods
      // is stored under a key that shares its name with a type. If a source is
      // extended with such a method, it uses it to handle that type over the
      // function defined at `Source.prototype.url.urlGetter`.
    }
  , config.typeSpecificTreatments || {}
  )
}

extend(Source.prototype, {
  url: function url(citation) {
    var urlGetter = this[citation.type] || function(cite) {
      var properCitation = (
            // if canDeepLink contains either the citation type or '*'
            this.canDeepLink.indexOf(cite.type) != -1
            || this.canDeepLink.indexOf('*') != -1
            // return deep or 'shallow' link
            ? cite.fullCite
            : cite.mainCite
          )

      return this.baseUrl + urlEncode(properCitation)
    }

    return urlGetter.call(this, citation)
  }
, canHandle: function canHandle(type) {
    if ( present(type, this.cannot) === -1 ) {
      return true
    } else {
      return false
    }
  }
})

module.exports = Source
