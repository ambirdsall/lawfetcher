import { urlDecode, urlEncode } from '../../js/functions'

describe(`urlEncode`, () => {
  it(`replaces spaces with underscores`, () => {
    expect(urlEncode(`foo bar baz`)).toEqual(`foo_bar_baz`)
  })

  it(`otherwise uses standard URI encoding`, () => {
    expect(urlEncode(`¶;"§`)).toEqual(`%C2%B6%3B%22%C2%A7`)
  })
})

describe(`urlDecode`, () => {
  it(`replaces underscores with spaces`, () => {
    expect(urlDecode(`bar_baz_qux`)).toEqual(`bar baz qux`)
  })

  it(`otherwise uses standard URI decoding`, () => {
    expect(urlDecode(`%C2%B6%3B%22%C2%A7`)).toEqual(`¶;"§`)
  })
})
