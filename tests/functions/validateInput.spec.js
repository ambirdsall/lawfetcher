import { validateInput } from '../../js/functions'

describe(`validateInput()`, () => {
  describe(`whitelist`, () => {
    it(`allows letters`, () => {
      expect(validateInput(`ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz`)).toBe(true)
    })
    it(`allows spaces`,            () => { expect(validateInput(` `)).toBe(true) })
    it(`allows pilcrows`,          () => { expect(validateInput(`¶`)).toBe(true) })
    it(`allows numbers`,           () => { expect(validateInput(`0123456789`)).toBe(true) })
    it(`allows dashes`,            () => { expect(validateInput(`-—`)).toBe(true) })
    it(`allows parentheses`,       () => { expect(validateInput(`()`)).toBe(true) })
    it(`allows commas`,            () => { expect(validateInput(`,`)).toBe(true) })
    it(`allows periods`,           () => { expect(validateInput(`.`)).toBe(true) })
    it(`allows colons`,            () => { expect(validateInput(`:`)).toBe(true) })
    it(`allows apostrophes`,       () => { expect(validateInput(`'’`)).toBe(true) })
    it(`allows forward slashes`,   () => { expect(validateInput(`/`)).toBe(true) })
    it(`allows section symbols`,   () => { expect(validateInput(`§`)).toBe(true) })
    it(`allows paragraph symbols`, () => { expect(validateInput(`¶`)).toBe(true) })
    it(`returns false for everything else`, () => {
      expect(validateInput(`"`)).toBe(false)
      expect(validateInput(`;`)).toBe(false)
      expect(validateInput(`]`)).toBe(false)
      expect(validateInput(`ø`)).toBe(false)
      expect(validateInput(`µ`)).toBe(false)
    })
  })
})
