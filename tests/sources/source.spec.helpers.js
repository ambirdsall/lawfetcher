let H            = {}
const _          = require(`lodash`)
const U          = require(`../../js/utils`)
const Citation   = require(`../../js/types/citation`)
const Source     = require(`../../js/types/source`)
const genericUrl = require(`../../js/functions/genericUrl`)
const withTypeId = function withTypeId(typeName) { return (type) => type.typeId === typeName }

H.findType = U.curry(function findType(types, typeName) {
  return _.find(types, withTypeId(typeName))
})

H.getUrl = U.curry(function getUrl(source, types, citeText, typeName) {
  const currentType = H.findType(types, typeName)
  const citation    = Citation(citeText, currentType)

  return source.url(citation)
})

H.getUrls = U.curry(function getUrls(source, types, citationTexts, typeName) {
  const currentType = H.findType(types, typeName)

  return citationTexts.map(function(citeText) {
    const citation = Citation(citeText, currentType)

    return source.url(citation)
  })
})

H.replaceEach = function replaceEach(arr, str) {
  return arr.map(function() { return str })
}

// Specifically westlaw and lexis test urls
H.federalRuleNumber = function ruleNumber(federalRuleCite) {
  return _.head(federalRuleCite.match(/\d.*/))
}

module.exports = H
