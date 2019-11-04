import { Citation } from '../../js/types'
import makeDetectType from '../../js/functions/detectType'

const detectType = makeDetectType(Citation, mockTypes)
const mockTypes  = [
    { typeId:            `type_one`
    , idPattern:       /citation/i
    , mainCitePattern: /(.+) ?with/
    }
  , { typeId:            `type_two`
    , idPattern:       /c(?:itation)? ?(?:t(?:wo)?|2)/i
    , mainCitePattern: /(.+), \d+/
    }
  , { typeId:            `default`
    , idPattern:       /.*/
    , mainCitePattern: /(?:(.+\d+)(?:, (?:\u00b6 ?)?\d+))|(?:([^\(]+)(?:\s*\(.\))+)/
    }
  ]
const mockCitationText = `arbitrary citation text`
const mockJumpCiteText = `arbitrary citation text with jump cite`

describe(`The detectType function`, () => {
  it(`returns a Citation object`, () => {
    const detectTypeReturn = detectType(mockCitationText)

    expect(detectTypeReturn).toEqual(jasmine.any(Citation))
  })

  it(`assigns the first type whose idPattern matches the given text`, () => {
    const returnType = detectType(mockCitationText).type

    expect(returnType).toBe(`type_one`)
  })

  // The `default` type is defined in the list of type config objects, not the fn
  it(`assigns the default type if there is no match`, () => {
    const returnType = detectType(`foo bar baz qux`).type

    expect(returnType).toBe(`default`)
  })

  it(`separates out the matching type's jump cite, if present`, () => {
    const jumpCiteReturn   = detectType(mockJumpCiteText)
    const noJumpCiteReturn = detectType(mockCitationText)

    expect(jumpCiteReturn.jumpCite).toBe(`with jump cite`)
    expect(noJumpCiteReturn.jumpCite).toBe(``)
  })
})
