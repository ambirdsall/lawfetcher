import { find, map } from 'lodash-es'
import { Source, Citation } from '../../js/types'
import { sources, citationTypes } from '../../js/data'
import testCases from '../data/test_cases'
import {
  findType as makeFindType,
  getUrls as makeGetUrls,
  replaceEach,
} from './source.spec.helpers'

const ravelConfig = find(sources, (source) => source.name === `Ravel`)
const ravel       = new Source(ravelConfig)
const getUrls     = makeGetUrls(ravel, citationTypes)
const findType    = makeFindType(citationTypes)
const urlEncode   = window.encodeURIComponent

describe(`Ravel`, () => {
  it(`stores its baseUrl`, () => {
    expect(ravel.baseUrl).toBe(`http://www.ravellaw.com/search?query=`)
  })

  describe(`Unhandled citation types`, () => {
    it(`cannot handle a Federal Register citation`, () => {
      expect(ravel.canHandle(`federal_register`)).toBe(false)
    })

    it(`cannot handle a Uniform Commercial Code citation`, () => {
      expect(ravel.canHandle(`uniform_commercial_code`)).toBe(false)
    })

    it(`cannot handle a WL database citation`, () => {
      expect(ravel.canHandle(`wl_database`)).toBe(false)
    })

    it(`cannot handle a Public Law citation`, () => {
      expect(ravel.canHandle(`public_law`)).toBe(false)
    })

    it(`cannot handle a Statutes at Large citation`, () => {
      expect(ravel.canHandle(`statutes_at_large`)).toBe(false)
    })

    it(`cannot handle a Law Journal citation`, () => {
      expect(ravel.canHandle(`law_journal`)).toBe(false)
    })
  })

  it(`makes the proper url for a US Constitution citation`, () => {
    var citations = [
          `U.S. CONST. art. I, § 7, cl. 1`
        , `U.S. Const. amend. XIV, § 1`
        ]
      , urls = [
          `http://www.ravellaw.com/search?query=U.S.%20CONST.%20art.%20I%2C%20%C2%A7%207`
        , `http://www.ravellaw.com/search?query=U.S.%20Const.%20amend.%20XIV%2C%20%C2%A7%201`
        ]

    expect(getUrls(citations, `us_constitution`)).toEqual(urls)
  })

  it(`makes the proper url for a Code of Federal Regulations citation`, () => {
    expect(ravel.canHandle(`cfr`)).toBe(false)
  })

  it(`makes the proper url for a United States Code citation`, () => {
    var citations = [
        `42 U.S.C. § 2000e-2(a)`
      ]
    , results   = getUrls(citations, `usc`)
    , properUrl = `https://www.ravellaw.com/statutes/us:usc:t42/us:usc:t42:s2000e-2?query=42%20U.S.C.%20%C2%A7%202000e-2(a)`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`makes the proper url for a Federal Register citation`, () => {
    expect(ravel.canHandle(`federal_register`)).toBe(false)
  })

  it(`makes the proper url for a Federal Rule of Appellate Procedure citation`, () => {
    const citations  = testCases.frap.all
    const results    = getUrls(citations, `frap`)
    const properUrls = map(citations, (cite) => `${ravel.baseUrl}${urlEncode(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Criminal Procedure citation`, () => {
    const citations  = testCases.frcrmp.all
    const results    = getUrls(citations, `frcrmp`)
    const properUrls = map(citations, (cite) => `${ravel.baseUrl}${urlEncode(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Civil Procedure citation`, () => {
    const citations  = testCases.frcp.all
    const results    = getUrls(citations, `frcp`)
    const properUrls = map(citations, (cite) => `${ravel.baseUrl}${urlEncode(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Evidence citation`, () => {
    const citations  = testCases.fre.all
    const results    = getUrls(citations, `fre`)
    const properUrls = map(citations, (cite) => `${ravel.baseUrl}${urlEncode(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Bankruptcy Procedure citation`, () => {
    const citations  = testCases.frbp.all
    const results    = getUrls(citations, `frbp`)
    const properUrls = map(citations, (cite) => `${ravel.baseUrl}${urlEncode(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal case citation`, () => {
    const citations    = testCases.federal_case.all
    const results      = getUrls(citations, `federal_case`)
    const federal_case = findType(`federal_case`)
    const properUrls   = map(citations, (cite) => `${ravel.baseUrl}${urlEncode(Citation(cite, federal_case).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a state constitution citation`, () => {
    const citations          = testCases.state_constitution.all
    const results            = getUrls(citations, `state_constitution`)
    const state_constitution = findType(`state_constitution`)
    const properUrls         = map(citations, (cite) => `${ravel.baseUrl}${urlEncode(Citation(cite, state_constitution).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a law/statute/code/rule citation`, () => {
    const citations             = testCases.law_statute_code_rule.all
    const results               = getUrls(citations, `law_statute_code_rule`)
    const law_statute_code_rule = findType(`law_statute_code_rule`)
    const properUrls            = map(citations, (cite) => `${ravel.baseUrl}${urlEncode(Citation(cite, law_statute_code_rule).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the correct url for a docket number citation`, () => {
    const docketNumbers = testCases.docket_number.all
    const results       = getUrls(docketNumbers, `docket_number`)
    const properUrls    = map(docketNumbers, cite => `${ravel.baseUrl}"${urlEncode(cite)}"`)

    expect(ravel.canHandle(`docket_number`)).toBe(true)
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
    , properUrl = `http://www.ravellaw.com/search?query=2012%20WI%203`

    expect(jumpCiteResults).toEqual(noJumpCiteResults)
    expect(jumpCiteResults).toEqual(replaceEach(jumpCiteResults, properUrl))
    // Hooray for transitive equality!
  })
})

// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
