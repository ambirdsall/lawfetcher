var validateInput = require('../../js/functions/validateInput')

describe('validateInput()', function() {
  describe('whitelist', function() {
    it('returns false for non-whitelisted characters', function() {
      expect(validateInput(';')).toBe(false)
      expect(validateInput(']')).toBe(false)
      expect(validateInput('ø')).toBe(false)
      expect(validateInput('µ')).toBe(false)
    })

    it('allows spaces', function() {
      expect(validateInput(' ')).toBe(true)
    })

    it('allows pilcrows', function() {
      expect(validateInput('¶')).toBe(true)
    })

    it('allows letters', function() {
      expect(validateInput('ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz')).toBe(true)
    })

    it('allows numbers', function() {
      expect(validateInput('0123456789')).toBe(true)
    })

    it('allows dashes', function() {
      expect(validateInput('-—')).toBe(true)
    })

    it('allows parentheses', function() {
      expect(validateInput('()')).toBe(true)
    })

    it('allows commas', function() {
      expect(validateInput(',')).toBe(true)
    })

    it('allows periods', function() {
      expect(validateInput('.')).toBe(true)
    })

    it('allows colons', function() {
      expect(validateInput(':')).toBe(true)
    })

    it('allows apostrophes', function() {
      expect(validateInput("'’")).toBe(true)
    })

    it('allows forward slashes', function() {
      expect(validateInput('/')).toBe(true)
    })

    it('allows section symbols', function() {
      expect(validateInput('§')).toBe(true)
    })

    it('allows paragraph symbols', function() {
      expect(validateInput('¶')).toBe(true)
    })
  })
})
