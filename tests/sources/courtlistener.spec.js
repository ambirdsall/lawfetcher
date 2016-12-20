const _                   = require(`lodash`)
const Source              = require(`../../js/types/source`)
const Citation            = require(`../../js/types/citation`)
const courtlistenerConfig = _.find(require(`../../js/data/source_list`), (source) => source.name === `CourtListener`)
const courtlistener       = new Source(courtlistenerConfig)
const types               = require(`../../js/data/type_list`)
const testCases           = require(`../data/test_cases`)
const H                   = require(`./source.spec.helpers`)
const getUrls             = H.getUrls(courtlistener, types)
const replaceEach         = H.replaceEach
const urlEncode           = window.encodeURIComponent

describe(`CourtListener Search`, () => {
  it(`stores its baseUrl`, () => {
    expect(courtlistener.baseUrl).toBe(`https://www.courtlistener.com/`)
  })

  describe(`Unhandled citation types`, () => {
    it(`cannot handle a Code of Federal Regulations citation`, () => {
      expect(courtlistener.canHandle(`cfr`)).toBe(false)
    })

    it(`cannot handle a United States Code citation`, () => {
      expect(courtlistener.canHandle(`usc`)).toBe(false)
    })

    it(`cannot handle a Uniform Commercial Code citation`, () => {
      expect(courtlistener.canHandle(`uniform_commercial_code`)).toBe(false)
    })

    it(`cannot handle a WL database citation`, () => {
      expect(courtlistener.canHandle(`wl_database`)).toBe(false)
    })

    it(`cannot handle a Public Law citation`, () => {
      expect(courtlistener.canHandle(`public_law`)).toBe(false)
    })

    it(`cannot handle a Statutes at Large citation`, () => {
      expect(courtlistener.canHandle(`statutes_at_large`)).toBe(false)
    })

    it(`cannot handle a Federal Register citation`, () => {
      expect(courtlistener.canHandle(`federal_register`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Appellate Procedure citation`, () => {
      expect(courtlistener.canHandle(`frap`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Criminal Procedure citation`, () => {
      expect(courtlistener.canHandle(`frcrmp`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Civil Procedure citation`, () => {
      expect(courtlistener.canHandle(`frcp`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Evidence citation`, () => {
      expect(courtlistener.canHandle(`fre`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Bankruptcy Procedure citation`, () => {
      expect(courtlistener.canHandle(`frbp`)).toBe(false)
    })

    it(`cannot handle a state constitution citation`, () => {
      expect(courtlistener.canHandle(`state_constitution`)).toBe(false)
    })

    it(`cannot handle a Law Journal citation`, () => {
      expect(courtlistener.canHandle(`law_journal`)).toBe(false)
    })

    it(`cannot handle a law/statute/code/rule citation`, () => {
      expect(courtlistener.canHandle(`law_statute_code_rule`)).toBe(false)
    })
  })

  it(`makes the proper url for a US Constitution citation`, () => {
    var citations = [
          `U.S. CONST. art. I, § 7, cl. 1`
        , `U.S. Const. amend. XIV, § 1`
        ]
      , urls = [
          `https://www.courtlistener.com/?citation=U.S.%20CONST.%20art.%20I%2C%20%C2%A7%207`
        , `https://www.courtlistener.com/?citation=U.S.%20Const.%20amend.%20XIV%2C%20%C2%A7%201`
        ]

    expect(getUrls(citations, `us_constitution`)).toEqual(urls)
  })

  it(`makes the proper url for a SCOTUS US Reports citation`, () => {
    var citations = [
        `554 U.S. 570`
      ]
    , results   = getUrls(citations, `scotus_us_reports`)
    , properUrl = `https://www.courtlistener.com/?citation=554%20U.S.%20570`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`makes the proper url for a Federal case citation`, () => {
    const citations   = testCases.federal_case.all
    const results     = getUrls(citations, `federal_case`)
    const federalCase = _.find(types, (t) => t.typeId === `federal_case`)
    const properUrls  = _.map(citations, (cite) => `${courtlistener.baseUrl}?citation=${urlEncode(Citation(cite, federalCase).mainCite)}`)

    expect(courtlistener.canHandle(`federal_case`)).toBe(true)
    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a docket number citation`, () => {
    const docketNumbers = testCases.docket_number.all
    // cite.slice(4) removes the "No. " from the beginning of the citation strings, leaving the raw docket number
    const properUrls = _.map(docketNumbers, cite => `${courtlistener.baseUrl}?docket_number=${urlEncode(cite.slice(4))}`)

    expect(courtlistener.canHandle(`docket_number`)).toBe(true)
    expect(getUrls(docketNumbers, `docket_number`)).toEqual(properUrls)
  })

  it("makes the proper url for a citation that doesn't match any type", () => {
    var citationsWithJumpCite = [
        `2012 WI 3, ¶ 24`
      ]
    , citationsWithoutJumpCite = [
        `2012 WI 3`
      ]
    , jumpCiteResults = getUrls(citationsWithJumpCite, `default`)
    , noJumpCiteResults = getUrls(citationsWithoutJumpCite, `default`)
    , properUrl = `https://www.courtlistener.com/?citation=2012%20WI%203`

    expect(jumpCiteResults).toEqual(replaceEach(jumpCiteResults, properUrl))
    expect(noJumpCiteResults).toEqual(jumpCiteResults)
  })
})

// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
