var H        = {}
, U          = require('../../search/js/modules/utils')
, Citation   = require('../../search/js/types/citation')
, genericUrl = require('../../search/js/functions/genericUrl')
, findType   = function findType(typeName) {
    return function(type) {
      return type.name === typeName
    }
  }

H.getUrls = U.curry(function getUrls(source, citations, types, typeName) {
  var currentType = types.filter(findType(typeName))[0]

  return citations.map(function(citeText) {
    var citation = new Citation(citeText, currentType)
    // FIXME: doesn't properly handle decorating url() (cf. google_scholar)
    , urlGetter  = source.url || genericUrl


    return urlGetter.call(source, citation)
  })
})

H.replaceEach = function replaceEach(arr, str) {
  return arr.map(function() { return str })
}

module.exports = H
