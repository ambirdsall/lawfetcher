import { find, map } from 'lodash-es'
import { Source, Citation } from '../../js/types'
import { sources, citationTypes } from '../../js/data'
import testCases from '../data/test_cases'
import {
  findType as makeFindType,
  getUrls as makeGetUrls,
  replaceEach,
} from './source.spec.helpers'

const justiaConfig = find(sources, (source) => source.name === `Justia`)
const justia       = new Source(justiaConfig)
const getUrls      = makeGetUrls(justia, citationTypes)
const findType     = makeFindType(citationTypes)
const urlEncode    = window.encodeURIComponent

describe(`Justia Search`, () => {
  it(`stores its baseUrl`, () => {
    expect(justia.baseUrl).toBe(`https://www.justia.com/search?cx=004471346504245195276%3Ajieqepl7s5a&sa=Search+Justia&q=`)
  })

  describe(`Unhandled citation citationTypes`, () => {
    it(`cannot handle a United States Code citation`, () => {
      expect(justia.canHandle(`usc`)).toBe(false)
    })

    it(`cannot handle a WL database citation`, () => {
      expect(justia.canHandle(`wl_database`)).toBe(false)
    })

    it(`cannot handle a Public Law citation`, () => {
      expect(justia.canHandle(`public_law`)).toBe(false)
    })

    it(`cannot handle a Statutes at Large citation`, () => {
      expect(justia.canHandle(`statutes_at_large`)).toBe(false)
    })

    it(`cannot handle a Federal Register citation`, () => {
      expect(justia.canHandle(`federal_register`)).toBe(false)
    })

    it(`cannot handle a Law Journal citation`, () => {
      expect(justia.canHandle(`law_journal`)).toBe(false)
    })
  })

  it(`makes the proper url for a US Constitution citation`, () => {
    var citations = [
          `U.S. CONST. art. I, § 7, cl. 1`
        , `U.S. Const. amend. XIV, § 1`
        ]
      , urls = [
          `https://www.justia.com/search?cx=004471346504245195276%3Ajieqepl7s5a&sa=Search+Justia&q=U.S.%20CONST.%20art.%20I%2C%20%C2%A7%207`
        , `https://www.justia.com/search?cx=004471346504245195276%3Ajieqepl7s5a&sa=Search+Justia&q=U.S.%20Const.%20amend.%20XIV%2C%20%C2%A7%201`
        ]

    expect(getUrls(citations, `us_constitution`)).toEqual(urls)
  })

  it(`makes the proper url for a Code of Federal Regulations citation`, () => {
    const citations  = testCases.cfr.title45part146
    const results    = getUrls(citations, `cfr`)
    const properUrls = map(citations, (cite) => `http://law.justia.com/cfr/title45/45cfr146_main_02.html`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Uniform Commercial Code citation`, () => {
    const citations               = testCases.uniform_commercial_code.all
    const results                 = getUrls(citations, `uniform_commercial_code`)
    const uniform_commercial_code = findType(`uniform_commercial_code`)
    const properUrls              = map(citations, (cite) => `${justia.baseUrl}${urlEncode(Citation(cite, uniform_commercial_code).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Appellate Procedure citation`, () => {
    const citations  = testCases.frap.all
    const results    = getUrls(citations, `frap`)
    const frap       = findType(`frap`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, frap).mainCite)
    const properUrls = map(citations, (cite) => `${justia.baseUrl}${encodeMain(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Criminal Procedure citation`, () => {
    const citations  = testCases.frcrmp.all
    const results    = getUrls(citations, `frcrmp`)
    const frcrmp     = findType(`frcrmp`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, frcrmp).mainCite)
    const properUrls = map(citations, (cite) => `${justia.baseUrl}${encodeMain(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Civil Procedure citation`, () => {
    const citations  = testCases.frcp.all
    const results    = getUrls(citations, `frcp`)
    const frcp       = findType(`frcp`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, frcp).mainCite)
    const properUrls = map(citations, (cite) => `${justia.baseUrl}${encodeMain(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Evidence citation`, () => {
    const citations  = testCases.fre.all
    const results    = getUrls(citations, `fre`)
    const fre        = findType(`fre`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, fre).mainCite)
    const properUrls = map(citations, (cite) => `${justia.baseUrl}${encodeMain(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Bankruptcy Procedure citation`, () => {
    const citations  = testCases.frbp.all
    const results    = getUrls(citations, `frbp`)
    const frbp       = findType(`frbp`)
    const encodeMain = (cite) => urlEncode(new Citation(cite, frbp).mainCite)
    const properUrls = map(citations, (cite) => `${justia.baseUrl}${encodeMain(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a SCOTUS US Reports citation`, () => {
    var citations = [
          `556 U.S. 848`
        , `493 U.S. 182`
        ]
      , urls = [
          `https://supreme.justia.com/cases/federal/us/556/848/`
        , `https://supreme.justia.com/cases/federal/us/493/182/`
        ]
      , results = getUrls(citations, `scotus_us_reports`)

    expect(results).toEqual(urls)
  })

  it(`makes the proper url for a Federal case citation`, () => {
    const citations    = testCases.federal_case.all
    const results      = getUrls(citations, `federal_case`)
    const federal_case = findType(`federal_case`)
    const properUrls   = map(citations, (cite) => `${justia.baseUrl}${urlEncode(Citation(cite, federal_case).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a state constitution citation`, () => {
    const citations          = testCases.state_constitution.all
    const results            = getUrls(citations, `state_constitution`)
    const state_constitution = findType(`state_constitution`)
    const properUrls         = map(citations, (cite) => `${justia.baseUrl}${urlEncode(Citation(cite, state_constitution).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a law/statute/code/rule citation`, () => {
    const citations             = testCases.law_statute_code_rule.all
    const results               = getUrls(citations, `law_statute_code_rule`)
    const law_statute_code_rule = findType(`law_statute_code_rule`)
    const properUrls            = map(citations, (cite) => `${justia.baseUrl}${urlEncode(Citation(cite, law_statute_code_rule).mainCite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the correct url for a docket number citation`, () => {
    const docketNumbers = testCases.docket_number.all
    const results       = getUrls(docketNumbers, `docket_number`)
    const properUrls    = map(docketNumbers, cite => `${justia.baseUrl}"${urlEncode(cite)}"`)

    expect(justia.canHandle(`docket_number`)).toBe(true)
    expect(results).toEqual(properUrls)
  })

  it("makes the proper url for a citation that doesn't match any type", () => {
    const citationsWithJumpCite = [
        `2012 WI 3, ¶ 24`
      ]
    const citationsWithoutJumpCite = [
        `2012 WI 3`
      ]
    const jumpCiteResults = getUrls(citationsWithJumpCite, `default`)
    const noJumpCiteResults = getUrls(citationsWithoutJumpCite, `default`)
    const properUrl = `https://www.justia.com/search?cx=004471346504245195276%3Ajieqepl7s5a&sa=Search+Justia&q=2012%20WI%203`

    expect(jumpCiteResults).toEqual(replaceEach(jumpCiteResults, properUrl))
    expect(noJumpCiteResults).toEqual(jumpCiteResults)
  })
})

// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
