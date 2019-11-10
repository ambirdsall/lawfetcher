import { map, random } from 'lodash-es'
import { Citation } from '../js/types'
import { stateAbbreviations } from '../js/data'
import testCases from './data/test_cases'

describe(`FORMER TROUBLE-MAKERS:`, () => {
  describe(`federal register`, () => {
    it(`identifies federal_register citations with no pincite`, () => {
      const frWithPincite = `75 Fed. Reg. 76,256`

      expect(Citation.from(frWithPincite).type).toBe(`federal_register`)
    })
    it(`identifies federal_register citations with a pincite`, () => {
      const frSansPincite = `75 Fed. Reg. 76`

      expect(Citation.from(frSansPincite).type).toBe(`federal_register`)
    })
    it(`doesn't identify citations using "Fed. Reg." as fre citations`, () => {
      const frWithPincite = `75 Fed. Reg. 76,256`

      expect(Citation.from(frWithPincite).type).not.toBe(`fre`)
    })
  })
})

describe(`law_journal`, () => {
  it(`identifies law_journal citations matching generic patterns`, () => {
    const jumpCiteLJs   = testCases.law_journal.jumpCite
    const noJumpCiteLJs = testCases.law_journal.noJumpCite
    const hardcodedLJs = testCases.law_journal.hardcodedJournalNames

    map(jumpCiteLJs, (lj) => {
      expect(Citation.from(lj).type).toBe(`law_journal`)
    })

    map(noJumpCiteLJs, (lj) => {
      expect(Citation.from(lj).type).toBe(`law_journal`)
    })

    map(hardcodedLJs, (lj) => {
      expect(Citation.from(lj).type).toBe(`law_journal`)
    })
  })
})

describe(`state_constitution`, () => {
  it(`requires a valid state abbreviation to match`, () => {
    const constitutionNames  = map(stateAbbreviations, abbr => `${abbr} ${coinFlip() ? `C` : `c`}onst`)
    const fakeConstitutions  = [ `foo const`
                               , `blah Const`
                               , `not a real const`
                               , `Etc. const`
                               ]

    map(constitutionNames, (constitution) => {
      expect(Citation.from(constitution).type).toBe(`state_constitution`)
    })

    map(fakeConstitutions, (constitution) => {
      expect(Citation.from(constitution).type).not.toBe(`state_constitution`)
    })
  })
})

describe(`docket_number`, () => {
  it(`only matches the bare docket number, with nothing preceding`, () => {
    const docketNumbers = testCases.docket_number.all
    const otherNumbers  = [ `Pub. L. No. 12345`
                          , `ECF No. 12345`
                          , `ASBCA No. 12345`
                          , `U.S. Patent No. 12345`
                          ]

    map(docketNumbers, (docketNum) => {
      expect(Citation.from(docketNum).type).toBe(`docket_number`)
    })

    map(otherNumbers, (otherNum) => {
      expect(Citation.from(otherNum).type).not.toBe(`docket_number`)
    })
  })
})

// returns 0 or 1
// 0 is falsey
// 1 is truthy
function coinFlip() { return random(1) }
