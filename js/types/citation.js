import { compact } from 'lodash-es'
import { requiredFields } from '../utils'
import { citationTypes } from '../data'
import { detectType } from '../functions'

const { extend, trim } = $

function Citation(citationText, config) {
  if ( !(this instanceof Citation)) return new Citation(citationText, config)

  requiredFields(config, `typeId`, `idPattern`, `mainCitePattern`)
  if ( !citationText.match(config.idPattern) ) {
    throw new Error(`"${citationText}" doesn't match ${config.typeId} type.`)
  }

  const mainCite = buildMainCite(citationText, config.mainCitePattern)
  const jumpCite = buildJumpCite(citationText, mainCite)

  const subparty = config._subparts || {}
  const subparts = buildSubparts({}, subparty, citationText)

  extend(this, subparts, {
    type:     config.typeId
  , mainCite: trim(mainCite)
  , jumpCite: jumpCite
  , fullCite: citationText
  })
}

Citation.from = detectType(Citation, citationTypes)

export default Citation

// mainCitePatterns match against the jump cite of the given type, with
// everything preceding the jump cite put in a capture group. If the citation
// has a jump cite, the content of the capture group (i.e. everything BUT the
// jump cite) is returned; if not, the entire citation text is returned.
function buildMainCite (citationText, mainCitePattern) {
  const matchData = citationText.match(mainCitePattern)

  // the default type checks against two jump cite patterns; it will have one
  // string and one undefined for matchData[1] & matchData[2], in arbitrary
  // order. Thus the need for `compact`.
  return ( !!matchData )
         ? ( compact(matchData)[1] )
         : citationText
}

function buildJumpCite (citationText, mainCiteText) {
  return ( citationText === mainCiteText )
         ? ``
         : citationText.slice(mainCiteText.length)
}

// self is extended from properties of subparty
//  for each property:
//    self.key is same name as config._subparts.key
//    self.key has same value as config._subparts.key(citationText)
function buildSubparts (self, subparty, citationText) {
  for ( let propertyName in subparty ) {
    ((propertyName) => {
      self[propertyName] = subparty[propertyName].call(self, citationText)
    })(propertyName)
  }

  return self
}
