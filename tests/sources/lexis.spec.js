import { difference, isFunction, find, map } from 'lodash-es'
import { Source, Citation } from '../../js/types'
import { sources, citationTypes } from '../../js/data'
import testCases from '../data/test_cases'
import {
  getUrls as makeGetUrls,
  replaceEach,
} from './source.spec.helpers'

const lexisConfig = find(sources, (source) => source.name === `Lexis`)
const lexis       = new Source(lexisConfig)
const getUrls     = getUrls(lexis, citationTypes)
const findType    = findType(citationTypes)
const urlEncode   = window.encodeURIComponent

describe(`Lexis`, () => {
  it(`stores its baseUrl`, () => {
    expect(lexis.baseUrl).toBe(`http://advance.lexis.com/laapi/search?q=`)
  })

  it(`has the expected _typeSpecificUrls`, () => {
    var allTypes = citationTypes.map(function(t) { return t.name })
      , expectedTSTs = [
          `frap`
        , `frcp`
        , `frcrmp`
        , `frbp`
        , `fre`
        , `default`
        ]
      , lexisTSTs = allTypes.filter(function(typeName) { lexis.hasOwnProperty(typeName) && isFunction(lexis[typeName]) })

    expect(difference(lexisTSTs, expectedTSTs)).toEqual([])
  })

  describe(`Unhandled citation types`, () => {
    it(`cannot handle a Public Law citation`, () => {
      expect(lexis.canHandle(`public_law`)).toBe(false)
    })
  })

  it(`makes the proper url for a US Constitution citation`, () => {
    var citations = [
          `U.S. CONST. art. I, § 7, cl. 1`
        , `U.S. Const. amend. XIV, § 1`
        ]
      , urls = [
          `http://advance.lexis.com/laapi/search?q=U.S.%20CONST.%20art.%20I%2C%20%C2%A7%207%2C%20cl.%201`
        , `http://advance.lexis.com/laapi/search?q=U.S.%20Const.%20amend.%20XIV%2C%20%C2%A7%201`
        ]

    expect(getUrls(citations, `us_constitution`)).toEqual(urls)
  })

  it(`makes the proper url for a Code of Federal Regulations citation`, () => {
    const citations  = testCases.cfr.all
    const results    = getUrls(citations, `cfr`)
    const properUrls = map(citations, (cite) => `${lexis.baseUrl}${urlEncode(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a United States Code citation`, () => {
    var citations = [
        `42 U.S.C. § 2000e-2(a)`
      ]
    , results   = getUrls(citations, `usc`)
    , properUrl = `http://advance.lexis.com/laapi/search?q=42%20U.S.C.%20%C2%A7%202000e-2(a)`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`makes the proper url for a Uniform Commercial Code citation`, () => {
    const citations               = testCases.uniform_commercial_code.all
    const results                 = getUrls(citations, `uniform_commercial_code`)
    const uniform_commercial_code = findType(`uniform_commercial_code`)
    const properUrls              = map(citations, (cite) => `${lexis.baseUrl}${urlEncode(Citation(cite, uniform_commercial_code).fullCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a WL database citation`, () => {
    const citations   = testCases.wl_database.all
    const results     = getUrls(citations, `wl_database`)
    const wl_database = findType(`wl_database`)
    const properUrls  = map(citations, (cite) => `${lexis.baseUrl}${urlEncode(Citation(cite, wl_database).fullCite)}`)

    expect(lexis.canHandle(`wl_database`)).toBe(true)
    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Statutes at Large citation`, () => {
    const citations         = testCases.statutes_at_large.all
    const results           = getUrls(citations, `statutes_at_large`)
    const statutes_at_large = findType(`statutes_at_large`)
    const properUrls        = map(citations, (cite) => `${lexis.baseUrl}${urlEncode(Citation(cite, statutes_at_large).fullCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Register citation`, () => {
    const citations        = testCases.federal_register.all
    const results          = getUrls(citations, `federal_register`)
    const federal_register = findType(`federal_register`)
    const properUrls       = map(citations, (cite) => `${lexis.baseUrl}${urlEncode(Citation(cite, federal_register).fullCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Appellate Procedure citation`, () => {
    const citations  = testCases.frap.all
    const results    = getUrls(citations, `frap`)
    const properUrls = map(citations, (cite) => `${lexis.baseUrl}frap%20${H.federalRuleNumber(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Criminal Procedure citation`, () => {
    const citations  = testCases.frcrmp.all
    const results    = getUrls(citations, `frcrmp`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, frcrmp).mainCite)
    const properUrls = map(citations, (cite) => `${lexis.baseUrl}frcrp%20${H.federalRuleNumber(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Civil Procedure citation`, () => {
    const citations  = testCases.frcp.all
    const results    = getUrls(citations, `frcp`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, frcp).mainCite)
    const properUrls = map(citations, (cite) => `${lexis.baseUrl}frcp%20${H.federalRuleNumber(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Evidence citation`, () => {
    const citations  = testCases.fre.all
    const results    = getUrls(citations, `fre`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, fre).mainCite)
    const properUrls = map(citations, (cite) => `${lexis.baseUrl}fre%20${H.federalRuleNumber(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Bankruptcy Procedure citation`, () => {
    const citations  = testCases.frbp.all
    const results    = getUrls(citations, `frbp`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, frbp).mainCite)
    const properUrls = map(citations, (cite) => `${lexis.baseUrl}frbp%20${H.federalRuleNumber(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal case citation`, () => {
    const citations    = testCases.federal_case.all
    const results      = getUrls(citations, `federal_case`)
    const federal_case = findType(`federal_case`)
    const properUrls   = map(citations, (cite) => `${lexis.baseUrl}${urlEncode(Citation(cite, federal_case).fullCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a state constitution citation`, () => {
    const citations          = testCases.state_constitution.all
    const results            = getUrls(citations, `state_constitution`)
    const state_constitution = findType(`state_constitution`)
    const properUrls         = map(citations, (cite) => `${lexis.baseUrl}${urlEncode(Citation(cite, state_constitution).fullCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Law Journal citation`, () => {
    const citations   = testCases.law_journal.all
    const results     = getUrls(citations, `law_journal`)
    const law_journal = findType(`law_journal`)
    const properUrls  = map(citations, (cite) => `${lexis.baseUrl}${urlEncode(Citation(cite, law_journal).mainCite)}`)

    expect(lexis.canHandle(`law_journal`)).toBe(true)
    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a law/statute/code/rule citation`, () => {
    const citations             = testCases.law_statute_code_rule.all
    const results               = getUrls(citations, `law_statute_code_rule`)
    const law_statute_code_rule = findType(`law_statute_code_rule`)
    const properUrls            = map(citations, (cite) => `${lexis.baseUrl}${urlEncode(Citation(cite, law_statute_code_rule).fullCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the correct url for a docket number citation`, () => {
    const docketNumbers = testCases.docket_number.all
    const results       = getUrls(docketNumbers, `docket_number`)
    const properUrls    = map(docketNumbers, cite => `${lexis.baseUrl}"${urlEncode(cite)}"`)

    expect(lexis.canHandle(`docket_number`)).toBe(true)
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
    , jumpCiteResults     = getUrls(citationsWithJumpCite, `default`)
    , noJumpCiteResults   = getUrls(citationsWithoutJumpCite, `default`)
    , jumpCiteProperUrl   = `http://advance.lexis.com/laapi/search?q=2012%20WI%203%2C%2024`
    , noJumpCiteProperUrl = `http://advance.lexis.com/laapi/search?q=2012%20WI%203`

    expect(jumpCiteResults).toEqual(replaceEach(jumpCiteResults, jumpCiteProperUrl))
    expect(noJumpCiteResults).toEqual(replaceEach(noJumpCiteResults, noJumpCiteProperUrl))
  })
})

// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
