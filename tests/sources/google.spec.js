const _            = require(`lodash`)
const Source       = require(`../../js/types/source`)
const Citation     = require(`../../js/types/citation`)
const googleConfig = _.find(require(`../../js/data/source_list`), (source) => source.name === `Google Search`)
const google       = new Source(googleConfig)
const types        = require(`../../js/data/type_list`)
const testCases    = require(`../data/test_cases`)
const H            = require(`./source.spec.helpers`)
const getUrls      = H.getUrls(google, types)
const replaceEach  = H.replaceEach
const urlEncode    = window.encodeURIComponent

describe(`Google Search`, () => {
  it(`stores its baseUrl`, () => {
    expect(google.baseUrl).toBe(`https://google.com/search?q=`)
  })

  it(`cannot handle a WL database citation`, () => {
    expect(google.canHandle(`wl_database`)).toBe(false)
  })

  it(`wraps docket number citations in quotes`, () => {
    const docketNumbers = testCases.docket_number.all
    const results       = getUrls(docketNumbers, `docket_number`)
    const properUrls    = _.map(docketNumbers, cite => `${google.baseUrl}"${urlEncode(cite)}"`)

    expect(google.canHandle(`docket_number`)).toBe(true)
    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a google search for every other type of citation`, () => {
    var us_consts = [
          `U.S. CONST. art. I, § 7, cl. 1`
        , `U.S. Const. amend. XIV, § 1`
        ]
      , uscs = [
          `123 U.S.C. § 2000e-2(a)`
        ]
      , fraps = [
          `Federal Rules of Appellate Procedure 26.1(b)`
        ]
      , urls = [
          `https://google.com/search?q=U.S.%20CONST.%20art.%20I%2C%20%C2%A7%207%2C%20cl.%201`
        , `https://google.com/search?q=U.S.%20Const.%20amend.%20XIV%2C%20%C2%A7%201`
        , `https://google.com/search?q=123%20U.S.C.%20%C2%A7%202000e-2(a)`
        , `https://google.com/search?q=Federal%20Rules%20of%20Appellate%20Procedure%2026.1(b)`
        ]
      , results = _.concat(getUrls(us_consts, `us_constitution`), getUrls(uscs, `usc`), getUrls(fraps, `frap`))

    expect(results).toEqual(urls)
  })
})

// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
