import { find, head } from 'lodash-es'
import { curry } from '../../js/utils'
import { Citation, Source } from '../../js/types'
import { genericUrl } from '../../js/functions'

function withTypeId(typeName) { return (type) => type.typeId === typeName }

export const findType = curry(function findType(types, typeName) {
  return find(types, withTypeId(typeName))
})

export const getUrl = curry(function getUrl(source, types, citeText, typeName) {
  const currentType = findType(types, typeName)
  const citation    = Citation(citeText, currentType)

  return source.url(citation)
})

export const getUrls = curry(function getUrls(source, types, citationTexts, typeName) {
  const currentType = findType(types, typeName)

  return citationTexts.map(function(citeText) {
    const citation = Citation(citeText, currentType)

    return source.url(citation)
  })
})

export const replaceEach = function replaceEach(arr, str) {
  return arr.map(function() { return str })
}

// Specifically westlaw and lexis test urls
export const federalRuleNumber = function ruleNumber(federalRuleCite) {
  return head(federalRuleCite.match(/\d.*/))
}
