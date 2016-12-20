const _ = require(`lodash`)

describe(`A citation`, () => {
  // takes citationText and a type object
  const Citation    = require(`../js/types/citation`)
  const testType    = { typeId:          `test_type`
                      , idPattern:       /test/i
                      , mainCitePattern: /(.+), okay\?/
                      }
  const validText   = `this is a test, okay?`
  const invalidText = `this is not`

  describe(`constructor function`, () => {
    it(`works the same with or without the new keyword`, () => {
      const withNew = new Citation(validText, testType)
      const withoutANew = Citation(validText, testType)

      expect(withNew.prototype).toBe(withoutANew.prototype)
    })

    describe(`extending with config._subparts`, () => {
      it(`extends w/ all keys of _subparts, w/ each value equivalent to _subparts.key.call(new instance, citationText)`, () => {
        // subparts is singly-nested objects :: { name: { name: function } }
        const subparts = { _subparts: { kay: citeText => _.head(citeText.match(/.kay./)) } }
        const noInit  = Citation(validText, testType)
        const yesInit = Citation(validText, _.extend(testType, subparts))

        expect(noInit.kay).toBeUndefined()
        expect(yesInit.kay).toEqual(`okay?`)
      })

      it(`config._subparts cannot override standard properties`, () => {
        const subparts = { _subparts: { type:     citeText => `a conflicting type!`
                                      , mainCite: citeText => `a conflicting mainCite!`
                                      , jumpCite: citeText => `a conflicting jumpCite!`
                                      , fullCite: citeText => `a conflicting fullCite!`
                                      , noun:     citeText => _.head(_.tail(citeText.match(/(\w+),/)))
                                      }
                         }
        const noInit  = Citation(validText, testType)
        const yesInit = Citation(validText, _.extend(testType, subparts))

        expect(noInit.type).toEqual(`test_type`)
        expect(yesInit.type).toEqual(`test_type`)
        expect(noInit.mainCite).toEqual(`this is a test`)
        expect(yesInit.mainCite).toEqual(`this is a test`)
        expect(noInit.jumpCite).toEqual(`, okay?`)
        expect(yesInit.jumpCite).toEqual(`, okay?`)
        expect(noInit.fullCite).toEqual(`this is a test, okay?`)
        expect(yesInit.fullCite).toEqual(`this is a test, okay?`)

        // Anything else is still works as before, though
        expect(noInit.noun).toBeUndefined()
        expect(yesInit.noun).toEqual(`test`)
      })
    })
  })

  describe(`A valid citation`, () => {
    const valid = Citation(validText, testType)

    it(`knows the name of its type`, () => {
      expect(valid.type).toBe(`test_type`)
    })

    it(`can give the main citation with no jump cite`, () => {
      expect(valid.mainCite).toBe(`this is a test`)
    })

    it(`can give the jump cite without the rest of the citation`, () => {
      expect(valid.jumpCite).toBe(`, okay?`)
    })

    it(`can give the full citation`, () => {
      expect(valid.fullCite).toBe(validText)
    })
  })

  describe(`An invalid citation`, () => {
    it(`throws an error`, () => {
      const buildingWithInvalidText = () =>  Citation(invalidText, testType)

      expect(buildingWithInvalidText).toThrow()
    })
  })
})
