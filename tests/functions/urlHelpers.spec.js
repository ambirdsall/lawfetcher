const _url      = require(`../../js/functions/urlHelpers`)

describe(`urlEncode`, () => {
  it(`replaces spaces with underscores`, () => {
    expect(_url.urlEncode(`foo bar baz`)).toEqual(`foo_bar_baz`)
  })

  it(`otherwise uses standard URI encoding`, () => {
    expect(_url.urlEncode(`¶;"§`)).toEqual(`%C2%B6%3B%22%C2%A7`)
  })
})

describe(`urlDecode`, () => {
  it(`replaces underscores with spaces`, () => {
    expect(_url.urlDecode(`bar_baz_qux`)).toEqual(`bar baz qux`)
  })

  it(`otherwise uses standard URI decoding`, () => {
    expect(_url.urlDecode(`%C2%B6%3B%22%C2%A7`)).toEqual(`¶;"§`)
  })
})
