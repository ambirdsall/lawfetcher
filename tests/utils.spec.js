describe(`The utils object`, () => {
  const U = require(`../js/utils`)

  describe(`extend function`, () => {
    it(`adds properties of all subsequent arguments to its first argument`, () => {
      let baseObj    = {old: true}
      const mixinOne = {new: true}
      const mixinTwo = {newer: true}

      U.extend(baseObj, mixinOne, mixinTwo)

      expect(baseObj).toEqual({old: true, new: true, newer: true})
    })

    it(`overwrites pre-existing properties every time it's given a new property of the same name`, () => {
      let baseObj    = {old: true, new: false}
      const mixinOne = {new: true}
      const mixinTwo = {new: `very true`}

      U.extend(baseObj, mixinOne)
      expect(baseObj).toEqual({old: true, new: true})

      U.extend(baseObj, mixinTwo)
      expect(baseObj).toEqual({old: true, new: `very true`})
    })
  })
  describe(`escapeRegExp function`, () => {
    it(`escapes special characters for regex`, () => {
      expect(U.escapeRegExp(`?`)).toBe(`\\?`)
    })
  })
  describe(`after function`, () => {
    it(`can compose two functions`, () => {
      const f = function addThree(x) { return x + 3 }
      const g = function timesTwo(y) { return y * 2 }
      const effOfGee = U.after(g, f).call(this, 0)

      expect(effOfGee).toBe( f(g(0)) )
      expect(effOfGee).not.toBe( g(f(0)) )
    })
  })
  describe(`pipeline function`, () => {
    it(`can compose several functions`, () => {
      const add5    = n => n + 5
      const times10 = n => n * 10
      const pl      = U.pipeline(add5, times10, Math.sqrt)

      expect(pl(5)).toBe(10)
    })
  })
  describe(`curry function`, () => {
    it(`takes a function and returns a logically equivalent function`, () => {
      const add    = function add(x, y) { return x + y }
      const newAdd = U.curry(add)

      expect(newAdd(1, 5)).toEqual(add(1, 5))
    })

    it(`lets you "pre-fill" arguments to the new function`, () => {
      const newAdd = U.curry(function add(x, y) { return x + y })
      const addOne = newAdd(1)

      expect(addOne(5)).toEqual(6)
    })
  })
  describe(`requireFields function`, () => {
    it(`takes an object and any number of required keys`, () => {
      const a_and_b       = {a: 1, b: 2}
      const a_and_b_and_c = {a: 1, b: 2, c: null}

      expect(U.requireFields(a_and_b, `a`, `b`)).toBe(true)
      expect(U.requireFields(a_and_b_and_c, `a`, `b`, `c`)).toBe(true)
    })

    it(`throws an exception if the object is missing any of the specified keys`, () => {
      // camelCase is much harder to read with single-letter "words"
      const a_and_b              = {a: 1, b: 2}
      const a_and_b_and_c        = {a: 1, b: 2, c: null}
      const callWithMissingField = U.requireFields.bind(this, a_and_b, `a`, `b`, `c`)
      const callWithOneField     = U.requireFields.bind(this, a_and_b, `a`)
      const callWithAllFields    = U.requireFields.bind(this, a_and_b_and_c, `a`, `b`, `c`)

      expect(callWithMissingField).toThrow()
      expect(callWithOneField).not.toThrow()
      expect(callWithAllFields).not.toThrow()
    })

    it(`doesn't care about non-specified keys or the value of the keys`, () => {
      const a_and_b       = {a: undefined, b: 2}
      const a_and_b_and_c = {a: 1, b: 2, c: null}

      expect(U.requireFields(a_and_b, `a`)).toBe(true)
      expect(U.requireFields(a_and_b_and_c, `c`)).toBe(true)
    })
  })
  describe(`matchAnyOf function`, () => {
    it(`can take regex arguments`, () => {
      expect(U.matchAnyOf.bind(this, /foo/)).not.toThrow()
      expect(U.matchAnyOf.bind(this, /foo/, /bar/)).not.toThrow()
    })

    it(`can take string arguments`, () => {
      expect(U.matchAnyOf.bind(this, `foo`)).not.toThrow()
      expect(U.matchAnyOf.bind(this, `foo`, `bar`)).not.toThrow()
    })

    it(`or both!`, () => {
      expect(U.matchAnyOf.bind(this, /foo/, `bar`)).not.toThrow()
    })

    it(`nothing else, though`, () => {
      expect(U.matchAnyOf.bind(this, 17, `even if some args are correct`)).toThrow()
    })

    it(`returns a regex`, () => {
      expect(U.matchAnyOf(/foo/, `bar`)).toEqual(jasmine.any(RegExp))
    })

    it(`matches string arguments literally, not as regexes`, () => {
      const pattern = U.matchAnyOf(`superm.*n`)//, `d[aeiou]nk`)

      expect(`superman`).not.toMatch(pattern)
      expect(`supermoon`).not.toMatch(pattern)
      expect(`superm.*n`).toMatch(pattern)
      // expect(`dunk`).not.toMatch(pattern)
      // expect(`d[aeiou]nk`).toMatch(pattern)
    })

    it(`matches anything one of its arguments matches`, () => {
      const pattern = U.matchAnyOf(`bear`, /superm.*n/, `J.L. & Econ.`)

      expect(`bear`).toMatch(pattern)
      expect(`superman`).toMatch(pattern)
      expect(`supermoon`).toMatch(pattern)
      expect(`17 J.L. & Econ. 142`).toMatch(pattern)
    })
  })
  describe(`matchAllOf function`, () => {
    it(`can take regex arguments`, () => {
      expect(U.matchAllOf.bind(this, /foo/)).not.toThrow()
      expect(U.matchAllOf.bind(this, /foo/, /bar/)).not.toThrow()
    })

    it(`can take string arguments`, () => {
      expect(U.matchAllOf.bind(this, `foo`)).not.toThrow()
      expect(U.matchAllOf.bind(this, `foo`, `bar`)).not.toThrow()
    })

    it(`or both!`, () => {
      expect(U.matchAllOf.bind(this, /foo/, `bar`)).not.toThrow()
    })

    it(`nothing else, though`, () => {
      expect(U.matchAllOf.bind(this, 17, `even if some args are correct`)).toThrow()
    })

    it(`returns a regex`, () => {
      expect(U.matchAllOf(/foo/, `bar`)).toEqual(jasmine.any(RegExp))
    })

    it(`matches string arguments literally, not as regexes`, () => {
      const wildcardPattern       = U.matchAllOf(`superm.*n`)
      const characterClassPattern = U.matchAllOf(`d[aeiou]nk`)

      expect(`superman`).not.toMatch(wildcardPattern)
      expect(`supermoon`).not.toMatch(wildcardPattern)
      expect(`superm.*n`).toMatch(wildcardPattern)
      expect(`dunk`).not.toMatch(characterClassPattern)
      expect(`d[aeiou]nk`).toMatch(characterClassPattern)
    })

    it(`only matches if all of its arguments are matched, in order`, () => {
      const patternOne = U.matchAllOf(`bear`, /superm.*n/, `J.L. & Econ.`)

      expect(`bear`).not.toMatch(patternOne)
      expect(`superman`).not.toMatch(patternOne)
      expect(`supermoon`).not.toMatch(patternOne)
      expect(`17 J.L. & Econ. 142`).not.toMatch(patternOne)

      expect(`bearsupermanJ.L. & Econ.`).toMatch(patternOne)
      expect(`bearsupermodulationJ.L. & Econ.`).toMatch(patternOne)

      const patternTwo = U.matchAllOf(`my `, /[Nn]ative /, U.matchAnyOf(`language`, `country`, `app`))

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
      expect(U.captureGroup(/foo (b.r)/, `foo bar`)).toEqual(`bar`)
    })

    it(`returns null if the string doesn't match the pattern's capture group`, () => {
      expect(U.captureGroup(/foo (b.r)/, `foo bear`)).toEqual(null)
      expect(U.captureGroup(/foo (b.r)/, `foo bar`)).not.toEqual(null)
    })

    describe(`optional capture group number argument`, () => {
      it(`returns the first capture group's match by default`, () => {
        expect(U.captureGroup(/(foo) (b.r)/, `foo bar`)).toBe(`foo`)
      })

      it(`uses 1-based indexing for capture group numbers`, () => {
        expect(U.captureGroup(/(foo) (b.r)/, `foo bar`, 1)).toBe(`foo`)
        expect(U.captureGroup(/(foo) (b.r)/, `foo bar`, 2)).toBe(`bar`)
      })
    })
  })
})
