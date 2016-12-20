const _                    = require(`lodash`)
const Source               = require(`../../js/types/source`)
const Citation             = require(`../../js/types/citation`)
const google_scholarConfig = _.find(require(`../../js/data/source_list`), (source) => source.name === `Google Scholar`)
const google_scholar       = new Source(google_scholarConfig)
const types                = require(`../../js/data/type_list`)
const testCases            = require(`../data/test_cases`)
const H                    = require(`./source.spec.helpers`)
const getUrl               = H.getUrl(google_scholar, types)
const getUrls              = H.getUrls(google_scholar, types)
const replaceEach          = H.replaceEach
const findType             = H.findType(types)
const urlEncode            = window.encodeURIComponent

describe(`Google Scholar`, () => {
  it(`stores its baseUrl`, () => {
    expect(google_scholar.baseUrl).toBe(`https://scholar.google.com/scholar?as_sdt=2006&hl=en&q=`)
  })

  describe(`Unhandled citation types`, () => {
    it(`cannot handle a Uniform Commercial Code citation`, () => {
      expect(google_scholar.canHandle(`uniform_commercial_code`)).toBe(false)
    })

    it(`cannot handle a WL database citation`, () => {
      expect(google_scholar.canHandle(`wl_database`)).toBe(false)
    })

    it(`cannot handle a Public Law citation`, () => {
      expect(google_scholar.canHandle(`public_law`)).toBe(false)
    })

    it(`cannot handle a Statutes at Large citation`, () => {
      expect(google_scholar.canHandle(`statutes_at_large`)).toBe(false)
    })

    it(`cannot handle a Federal Register citation`, () => {
      expect(google_scholar.canHandle(`federal_register`)).toBe(false)
    })

    it(`cannot handle a Law Journal citation`, () => {
      expect(google_scholar.canHandle(`law_journal`)).toBe(false)
    })
  })

  it(`wraps citation portion of url in double quotes`, () => {
    var citation = `foo`

    expect(getUrl(citation, `default`)).toBe(google_scholar.baseUrl + `"foo"`)
  })

  it(`makes the proper url for a US Constitution citation`, () => {
    var citations = [
          `U.S. CONST. art. I, § 7, cl. 1`
        , `U.S. Const. amend. XIV, § 1`
        ]
      , urls = [
          `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="U.S.%20CONST.%20art.%20I%2C%20%C2%A7%207"`
        , `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="U.S.%20Const.%20amend.%20XIV%2C%20%C2%A7%201"`
        ]

    expect(getUrls(citations, `us_constitution`)).toEqual(urls)
  })

  it(`makes the proper url for a Code of Federal Regulations citation`, () => {
    const citations = testCases.cfr.all
    const results   = getUrls(citations, `cfr`)
    const properUrls = [ `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="45%20C.F.R.%20%C2%A7%20147.130(a)(iv)"`
                       , `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="45%20C.F.R.%20%C2%A7%20147.130(a)(1)(iv)"`
                       , `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="40%20C.F.R.%20%C2%A7%C2%A7%2061.145(c)(6)(i)%2C%2061.150"`
                       , `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="40%20C.F.R.%20%C2%A7%20763.90(i)(2)(i)"`
                       , `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="46%20C.F.R.%20%C2%A7%20292"`
                       , `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="20%20CFR%20%C2%A7%C2%A7%20404.1520%2C%20416.920"`
                       , `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="20%20CFR%20%C2%A7%C2%A7%20404.929%2C%20416.1429%2C%20422.201"`
                       ]

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a United States Code citation`, () => {
    var citations = [
        `123 U.S.C. § 2000e-2(a)`
      ]
    , results   = getUrls(citations, `usc`)
    , properUrl = `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="123%20U.S.C.%20%C2%A7%202000e-2(a)"`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`makes the proper url for a Federal Rule of Appellate Procedure citation`, () => {
    const citations  = testCases.frap.all
    const results    = getUrls(citations, `frap`)
    const frap       = findType(`frap`)
    const properUrls = _.map(citations, (cite) => `${google_scholar.baseUrl}"${urlEncode(cite)}"`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Criminal Procedure citation`, () => {
    const citations  = testCases.frcrmp.all
    const results    = getUrls(citations, `frcrmp`)
    const frcrmp     = findType(`frcrmp`)
    const properUrls = _.map(citations, (cite) => `${google_scholar.baseUrl}"${urlEncode(cite)}"`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Civil Procedure citation`, () => {
    const citations  = testCases.frcp.all
    const results    = getUrls(citations, `frcp`)
    const frcp       = findType(`frcp`)
    const properUrls = _.map(citations, (cite) => `${google_scholar.baseUrl}"${urlEncode(cite)}"`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Evidence citation`, () => {
    const citations  = testCases.fre.all
    const results    = getUrls(citations, `fre`)
    const fre        = findType(`fre`)
    const properUrls = _.map(citations, (cite) => `${google_scholar.baseUrl}"${urlEncode(cite)}"`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Bankruptcy Procedure citation`, () => {
    const citations  = testCases.frbp.all
    const results    = getUrls(citations, `frbp`)
    const frbp       = findType(`frbp`)
    const properUrls = _.map(citations, (cite) => `${google_scholar.baseUrl}"${urlEncode(cite)}"`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal case citation`, () => {
    const citations    = testCases.federal_case.all
    const results      = getUrls(citations, `federal_case`)
    const federal_case = findType(`federal_case`)
    const properUrls   = _.map(citations, (cite) => `${google_scholar.baseUrl}"${urlEncode(Citation(cite, federal_case).mainCite)}"`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a state constitution citation`, () => {
    const citations          = testCases.state_constitution.all
    const results            = getUrls(citations, `state_constitution`)
    const state_constitution = findType(`state_constitution`)
    const properUrls         = _.map(citations, (cite) => `${google_scholar.baseUrl}"${urlEncode(Citation(cite, state_constitution).mainCite)}"`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a law/statute/code/rule citation`, () => {
    const citations             = testCases.law_statute_code_rule.all
    const results               = getUrls(citations, `law_statute_code_rule`)
    const law_statute_code_rule = findType(`law_statute_code_rule`)
    const properUrls            = _.map(citations, (cite) => `${google_scholar.baseUrl}"${urlEncode(Citation(cite, law_statute_code_rule).mainCite)}"`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the correct url for a docket number citation`, () => {
    const docketNumbers = testCases.docket_number.all
    const results       = getUrls(docketNumbers, `docket_number`)
    const properUrls    = _.map(docketNumbers, cite => `${google_scholar.baseUrl}"${urlEncode(cite)}"`)

    expect(google_scholar.canHandle(`docket_number`)).toBe(true)
    expect(results).toEqual(properUrls)
  })

  it("makes the proper url for a citation that doesn't match any type", () => {
    var citationsWithJumpCite = [
        `2012 WI 3, ¶ 24`
      , `2012 WI 3, 24`
      ]
    , citationsWithoutJumpCite = [
        `2012 WI 3`
      , `2012 WI 3`
      ]
    , jumpCiteResults = getUrls(citationsWithJumpCite, `default`)
    , noJumpCiteResults = getUrls(citationsWithoutJumpCite, `default`)
    , properUrl = `https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="2012%20WI%203"`

    expect(jumpCiteResults).toEqual(noJumpCiteResults)
    expect(jumpCiteResults).toEqual(replaceEach(jumpCiteResults, properUrl))
    // Hooray for transitive equality!
  })
})

// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
