import { includes } from 'lodash-es'

import { requireFields, compose, extend } from '../utils'
import { genericUrl } from '../functions'

function Source(config) {
  if (! (this instanceof Source)) return new Source(config)

  requireFields(config, `name`, `baseUrl`, `_deepLinkableTypes`, `$anchor`, `_cannot`)
  extend(this, {
      name:               config.name
    , baseUrl:            config.baseUrl
    , _deepLinkableTypes: config._deepLinkableTypes
    , $anchor:            config.$anchor
    , _cannot:            config._cannot
    , _url:               config._url
    // By convention, _typeSpecificUrls is an object, each of whose methods
    // is stored under a key that shares its name with a type.
    //    ex. {usc: function (cite) { ... }, federal_case: function(cite) { ... } }
    // If a source is extended with such a method, it uses it to handle that
    // type over the function defined at `Source.prototype.url { urlGetter }`.
    }
  , config._typeSpecificUrls || {}
  )
}

extend(Source.prototype, {
  url: function url(citation) {
    const urlGetter = this[citation.type] || this._url || genericUrl

    return urlGetter.call(this, citation)
  }
, canHandle: function canHandle(type) {
    return ( includes(this._cannot, type) )
           ? false
           : true
  }
, canDeepLink: function canDeepLink(type) {
    return ( includes(this._deepLinkableTypes, type) || includes(this._deepLinkableTypes, `*`) )
  }
})

export default Source
