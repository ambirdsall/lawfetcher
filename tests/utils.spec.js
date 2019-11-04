import {
  compose,
  captureGroup,
  curry,
  escapeRegExp,
  extend,
  matchAllOf,
  matchAnyOf,
  pipeline,
  requiredFields
} from '../js/utils'

describe(`The utils object`, () => {
  describe(`extend function`, () => {
    it(`adds properties of all subsequent arguments to its first argument`, () => {
      let baseObj    = {old: true}
      const mixinOne = {new: true}
      const mixinTwo = {newer: true}

      extend(baseObj, mixinOne, mixinTwo)

      expect(baseObj).toEqual({old: true, new: true, newer: true})
    })

    it(`overwrites pre-existing properties every time it's given a new property of the same name`, () => {
      let baseObj    = {old: true, new: false}
      const mixinOne = {new: true}
      const mixinTwo = {new: `very true`}

      extend(baseObj, mixinOne)
      expect(baseObj).toEqual({old: true, new: true})

      extend(baseObj, mixinTwo)
      expect(baseObj).toEqual({old: true, new: `very true`})
    })
  })
  describe(`escapeRegExp function`, () => {
    it(`escapes special characters for regex`, () => {
      expect(escapeRegExp(`?`)).toBe(`\\?`)
    })
  })
  describe(`compose function`, () => {
    it(`can compose two functions`, () => {
      const f = function addThree(x) { return x + 3 }
      const g = function timesTwo(y) { return y * 2 }
      const effOfGee = compose(g, f).call(this, 0)

      expect(effOfGee).toBe( f(g(0)) )
      expect(effOfGee).not.toBe( g(f(0)) )
    })
  })
  describe(`pipeline function`, () => {
    it(`can compose several functions`, () => {
      const add5    = n => n + 5
      const times10 = n => n * 10
      const pl      = pipeline(add5, times10, Math.sqrt)

      expect(pl(5)).toBe(10)
    })
  })
  describe(`curry function`, () => {
    it(`takes a function and returns a logically equivalent function`, () => {
      const add    = function add(x, y) { return x + y }
      const newAdd = curry(add)

      expect(newAdd(1, 5)).toEqual(add(1, 5))
    })

    it(`lets you "pre-fill" arguments to the new function`, () => {
      const newAdd = curry(function add(x, y) { return x + y })
      const addOne = newAdd(1)

      expect(addOne(5)).toEqual(6)
    })
  })
  describe(`requireFields function`, () => {
    it(`takes an object and any number of required keys`, () => {
      const a_and_b       = {a: 1, b: 2}
      const a_and_b_and_c = {a: 1, b: 2, c: null}

      expect(requireFields(a_and_b, `a`, `b`)).toBe(true)
      expect(requireFields(a_and_b_and_c, `a`, `b`, `c`)).toBe(true)
    })

    it(`throws an exception if the object is missing any of the specified keys`, () => {
      // camelCase is much harder to read with single-letter "words"
      const a_and_b              = {a: 1, b: 2}
      const a_and_b_and_c        = {a: 1, b: 2, c: null}
      const callWithMissingField = requireFields.bind(this, a_and_b, `a`, `b`, `c`)
      const callWithOneField     = requireFields.bind(this, a_and_b, `a`)
      const callWithAllFields    = requireFields.bind(this, a_and_b_and_c, `a`, `b`, `c`)

      expect(callWithMissingField).toThrow()
      expect(callWithOneField).not.toThrow()
      expect(callWithAllFields).not.toThrow()
    })

    it(`doesn't care about non-specified keys or the value of the keys`, () => {
      const a_and_b       = {a: undefined, b: 2}
      const a_and_b_and_c = {a: 1, b: 2, c: null}

      expect(requireFields(a_and_b, `a`)).toBe(true)
      expect(requireFields(a_and_b_and_c, `c`)).toBe(true)
    })
  })
  describe(`matchAnyOf function`, () => {
    it(`can take regex arguments`, () => {
      expect(matchAnyOf.bind(this, /foo/)).not.toThrow()
      expect(matchAnyOf.bind(this, /foo/, /bar/)).not.toThrow()
    })

    it(`can take string arguments`, () => {
      expect(matchAnyOf.bind(this, `foo`)).not.toThrow()
      expect(matchAnyOf.bind(this, `foo`, `bar`)).not.toThrow()
    })

    it(`or both!`, () => {
      expect(matchAnyOf.bind(this, /foo/, `bar`)).not.toThrow()
    })

    it(`nothing else, though`, () => {
      expect(matchAnyOf.bind(this, 17, `even if some args are correct`)).toThrow()
    })

    it(`returns a regex`, () => {
      expect(matchAnyOf(/foo/, `bar`)).toEqual(jasmine.any(RegExp))
    })

    it(`matches string arguments literally, not as regexes`, () => {
      const pattern = matchAnyOf(`superm.*n`)//, `d[aeiou]nk`)

      expect(`superman`).not.toMatch(pattern)
      expect(`supermoon`).not.toMatch(pattern)
      expect(`superm.*n`).toMatch(pattern)
      // expect(`dunk`).not.toMatch(pattern)
      // expect(`d[aeiou]nk`).toMatch(pattern)
    })

    it(`matches anything one of its arguments matches`, () => {
      const pattern = matchAnyOf(`bear`, /superm.*n/, `J.L. & Econ.`)

      expect(`bear`).toMatch(pattern)
      expect(`superman`).toMatch(pattern)
      expect(`supermoon`).toMatch(pattern)
      expect(`17 J.L. & Econ. 142`).toMatch(pattern)
    })
  })
  describe(`matchAllOf function`, () => {
    it(`can take regex arguments`, () => {
      expect(matchAllOf.bind(this, /foo/)).not.toThrow()
      expect(matchAllOf.bind(this, /foo/, /bar/)).not.toThrow()
    })

    it(`can take string arguments`, () => {
      expect(matchAllOf.bind(this, `foo`)).not.toThrow()
      expect(matchAllOf.bind(this, `foo`, `bar`)).not.toThrow()
    })

    it(`or both!`, () => {
      expect(matchAllOf.bind(this, /foo/, `bar`)).not.toThrow()
    })

    it(`nothing else, though`, () => {
      expect(matchAllOf.bind(this, 17, `even if some args are correct`)).toThrow()
    })

    it(`returns a regex`, () => {
      expect(matchAllOf(/foo/, `bar`)).toEqual(jasmine.any(RegExp))
    })

    it(`matches string arguments literally, not as regexes`, () => {
      const wildcardPattern       = matchAllOf(`superm.*n`)
      const characterClassPattern = matchAllOf(`d[aeiou]nk`)

      expect(`superman`).not.toMatch(wildcardPattern)
      expect(`supermoon`).not.toMatch(wildcardPattern)
      expect(`superm.*n`).toMatch(wildcardPattern)
      expect(`dunk`).not.toMatch(characterClassPattern)
      expect(`d[aeiou]nk`).toMatch(characterClassPattern)
    })

    it(`only matches if all of its arguments are matched, in order`, () => {
      const patternOne = matchAllOf(`bear`, /superm.*n/, `J.L. & Econ.`)

      expect(`bear`).not.toMatch(patternOne)
      expect(`superman`).not.toMatch(patternOne)
      expect(`supermoon`).not.toMatch(patternOne)
      expect(`17 J.L. & Econ. 142`).not.toMatch(patternOne)

      expect(`bearsupermanJ.L. & Econ.`).toMatch(patternOne)
      expect(`bearsupermodulationJ.L. & Econ.`).toMatch(patternOne)

      const patternTwo = matchAllOf(`my `, /[Nn]ative /, matchAnyOf(`language`, `country`, `app`))

      expect(`my `).not.toMatch(patternTwo)
      expect(`my native `).not.toMatch(patternTwo)
      expect(`my native tongue`).not.toMatch(patternTwo)

      expect(`my native language`).toMatch(patternTwo)
      expect(`my Native language`).toMatch(patternTwo)
      expect(`my native country`).toMatch(patternTwo)
      expect(`my Native app`).toMatch(patternTwo)
    })
  })
  describe(`captureGroup function`, () => {
    it(`returns the substring matching the pattern's capture group`, () => {
      expect(captureGroup(/foo (b.r)/, `foo bar`)).toEqual(`bar`)
    })

    it(`returns null if the string doesn't match the pattern's capture group`, () => {
      expect(captureGroup(/foo (b.r)/, `foo bear`)).toEqual(null)
      expect(captureGroup(/foo (b.r)/, `foo bar`)).not.toEqual(null)
    })

    describe(`optional capture group number argument`, () => {
      it(`returns the first capture group's match by default`, () => {
        expect(captureGroup(/(foo) (b.r)/, `foo bar`)).toBe(`foo`)
      })

      it(`uses 1-based indexing for capture group numbers`, () => {
        expect(captureGroup(/(foo) (b.r)/, `foo bar`, 1)).toBe(`foo`)
        expect(captureGroup(/(foo) (b.r)/, `foo bar`, 2)).toBe(`bar`)
      })
    })
  })
})
