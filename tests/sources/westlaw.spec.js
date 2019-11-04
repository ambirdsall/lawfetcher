import { difference, isFunction, find, map } from 'lodash-es'
import { Source, Citation } from '../../js/types'
import { sources, citationTypes } from '../../js/data'
import testCases from '../data/test_cases'
import {
  getUrls as makeGetUrls,
  replaceEach,
} from './source.spec.helpers'

const westlawConfig = find(sources, (source) => source.name === `Westlaw`)
const westlaw       = new Source(westlawConfig)
const getUrls       = getUrls(westlaw, citationTypes)
const findType      = findType(citationTypes)
const urlEncode     = window.encodeURIComponent

describe(`Westlaw`, () => {
  it(`stores its baseUrl`, () => {
    expect(westlaw.baseUrl).toBe(`http://a.next.westlaw.com/Link/Document/FullText?findType=Y&cite=`)
  })

  it(`has the expected _typeSpecificUrls`, () => {
    var allTypes = citationTypes.map(function(t) { return t.name })
      , expectedTSTs = [
          `frap`
        , `frcp`
        , `frcrmp`
        , `frbp`
        , `fre`
        ]
      , westlawTSTs = allTypes.filter(function(typeName) { westlaw.hasOwnProperty(typeName) && isFunction(westlaw[typeName]) })

    expect(difference(westlawTSTs, expectedTSTs)).toEqual([])
  })

  describe(`Unhandled citation types`, () => {
    it(`cannot handle a docket number citation`, () => {
      expect(westlaw.canHandle(`docket_number`)).toBe(false)
    })
  })

  it(`makes the proper url for a US Constitution citation`, () => {
    const citations  = testCases.us_constitution.all
    const results    = getUrls(citations, `us_constitution`)
    const us_constitution        = findType(`us_constitution`)
    const properUrls = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, us_constitution).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Code of Federal Regulations citation`, () => {
    const citations  = testCases.cfr.all
    const results    = getUrls(citations, `cfr`)
    const cfr        = findType(`cfr`)
    const properUrls = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, cfr).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a United States Code citation`, () => {
    const citations  = testCases.usc.all
    const results    = getUrls(citations, `usc`)
    const usc        = findType(`usc`)
    const properUrls = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, usc).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Uniform Commercial Code citation`, () => {
    const citations               = testCases.uniform_commercial_code.all
    const results                 = getUrls(citations, `uniform_commercial_code`)
    const uniform_commercial_code = findType(`uniform_commercial_code`)
    const properUrls              = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, uniform_commercial_code).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a WL database citation`, () => {
    const citations   = testCases.wl_database.all
    const results     = getUrls(citations, `wl_database`)
    const wl_database = findType(`wl_database`)
    const properUrls  = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, wl_database).fullCite)}`)

    expect(westlaw.canHandle(`wl_database`)).toBe(true)
    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Public Law citation`, () => {
    const citations  = testCases.public_law.all
    const results    = getUrls(citations, `public_law`)
    const public_law = findType(`public_law`)
    const properUrls = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, public_law).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Statutes at Large citation`, () => {
    const citations  = testCases.statutes_at_large.all
    const results    = getUrls(citations, `statutes_at_large`)
    const statutes_at_large = findType(`statutes_at_large`)
    const properUrls = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, statutes_at_large).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Register citation`, () => {
    const citations  = testCases.federal_register.all
    const results    = getUrls(citations, `federal_register`)
    const federal_register        = findType(`federal_register`)
    const properUrls = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, federal_register).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Appellate Procedure citation`, () => {
    const citations  = testCases.frap.all
    const results    = getUrls(citations, `frap`)
    const frap        = findType(`frap`)
    const properUrls = map(citations, (cite) => `${westlaw.baseUrl}frap%20${H.federalRuleNumber(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Criminal Procedure citation`, () => {
    const citations  = testCases.frcrmp.all
    const results    = getUrls(citations, `frcrmp`)
    const frcrmp        = findType(`frcrmp`)
    const properUrls = map(citations, (cite) => `${westlaw.baseUrl}frcrp%20${H.federalRuleNumber(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Civil Procedure citation`, () => {
    const citations  = testCases.frcp.all
    const results    = getUrls(citations, `frcp`)
    const frcp        = findType(`frcp`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, frcp).mainCite)
    const properUrls = map(citations, (cite) => `${westlaw.baseUrl}frcp%20${H.federalRuleNumber(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Evidence citation`, () => {
    const citations  = testCases.fre.all
    const results    = getUrls(citations, `fre`)
    const fre        = findType(`fre`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, fre).mainCite)
    const properUrls = map(citations, (cite) => `${westlaw.baseUrl}fre%20${H.federalRuleNumber(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Bankruptcy Procedure citation`, () => {
    const citations  = testCases.frbp.all
    const results    = getUrls(citations, `frbp`)
    const frbp        = findType(`frbp`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, frbp).mainCite)
    const properUrls = map(citations, (cite) => `${westlaw.baseUrl}frbp%20${H.federalRuleNumber(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal case citation`, () => {
    const citations    = testCases.federal_case.all
    const results      = getUrls(citations, `federal_case`)
    const federal_case = findType(`federal_case`)
    const properUrls   = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, federal_case).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a state constitution citation`, () => {
    const citations          = testCases.state_constitution.all
    const results            = getUrls(citations, `state_constitution`)
    const state_constitution = findType(`state_constitution`)
    const properUrls         = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, state_constitution).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Law Journal citation`, () => {
    const citations   = testCases.law_journal.all
    const results     = getUrls(citations, `law_journal`)
    const law_journal = findType(`law_journal`)
    const properUrls  = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, law_journal).mainCite)}`)

    expect(westlaw.canHandle(`law_journal`)).toBe(true)
    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a law/statute/code/rule citation`, () => {
    const citations             = testCases.law_statute_code_rule.all
    const results               = getUrls(citations, `law_statute_code_rule`)
    const law_statute_code_rule = findType(`law_statute_code_rule`)
    const properUrls            = map(citations, (cite) => `${westlaw.baseUrl}${urlEncode(Citation(cite, law_statute_code_rule).mainCite)}`)

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
    , properUrl = `http://a.next.westlaw.com/Link/Document/FullText?findType=Y&cite=2012%20WI%203`

    expect(jumpCiteResults).toEqual(noJumpCiteResults)
    expect(jumpCiteResults).toEqual(replaceEach(jumpCiteResults, properUrl))
    // Hooray for transitive equality!
  })
})

// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
