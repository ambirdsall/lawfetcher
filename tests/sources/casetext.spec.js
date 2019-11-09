import { find, map } from 'lodash-es'
import { Source, Citation } from '../../js/types'
import { sources, citationTypes } from '../../js/data'
import testCases from '../data/test_cases'
import {
  findType as makeFindType,
  getUrls as makeGetUrls,
  replaceEach,
} from './source.spec.helpers'

const casetextConfig = find(sources, (source) => source.name === 'Casetext')
const casetext       = new Source(casetextConfig)
const getUrls        = makeGetUrls(casetext, citationTypes)
const findType       = makeFindType(citationTypes)
const urlEncode      = window.encodeURIComponent

describe(`Casetext Search`, () => {
  it(`stores its baseUrl`, () => {
    expect(casetext.baseUrl).toBe(`https://casetext.com/search?q=`)
  })

  describe(`Unhandled citation types`, () => {
    it(`cannot handle a Code of Federal Regulations citation`, () => {
      expect(casetext.canHandle(`cfr`)).toBe(false)
    })

    it(`cannot handle a United States Code citation`, () => {
      expect(casetext.canHandle(`usc`)).toBe(false)
    })

    it(`cannot handle a Uniform Commercial Code citation`, () => {
      expect(casetext.canHandle(`uniform_commercial_code`)).toBe(false)
    })

    it(`cannot handle a WL database citation`, () => {
      expect(casetext.canHandle(`wl_database`)).toBe(false)
    })

    it(`cannot handle a Public Law citation`, () => {
      expect(casetext.canHandle(`public_law`)).toBe(false)
    })

    it(`cannot handle a Statutes at Large citation`, () => {
      expect(casetext.canHandle(`statutes_at_large`)).toBe(false)
    })

    it(`cannot handle a Federal Register citation`, () => {
      expect(casetext.canHandle(`federal_register`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Appellate Procedure citation`, () => {
      expect(casetext.canHandle(`frap`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Criminal Procedure citation`, () => {
      expect(casetext.canHandle(`frcrmp`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Civil Procedure citation`, () => {
      expect(casetext.canHandle(`frcp`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Evidence citation`, () => {
      expect(casetext.canHandle(`fre`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Bankruptcy Procedure citation`, () => {
      expect(casetext.canHandle(`frbp`)).toBe(false)
    })

    it(`cannot handle a state constitution citation`, () => {
      expect(casetext.canHandle(`state_constitution`)).toBe(false)
    })

    it(`cannot handle a Law Journal citation`, () => {
      expect(casetext.canHandle(`law_journal`)).toBe(false)
    })

    it(`cannot handle a law/statute/code/rule citation`, () => {
      expect(casetext.canHandle(`law_statute_code_rule`)).toBe(false)
    })
  })

  it(`makes the proper url for a US Constitution citation`, () => {
    const citations = [ `U.S. CONST. art. I, § 7, cl. 1`
                      , `U.S. Const. amend. XIV, § 1`
                      ]
    const urls = [ `https://casetext.com/search?q=U.S.%20CONST.%20art.%20I%2C%20%C2%A7%207`
                 , `https://casetext.com/search?q=U.S.%20Const.%20amend.%20XIV%2C%20%C2%A7%201`
                 ]

    expect(getUrls(citations, `us_constitution`)).toEqual(urls)
  })

  it(`makes the proper url for a SCOTUS US Reports citation`, () => {
    var citations = [
        `554 U.S. 570`
      ]
    , results   = getUrls(citations, `scotus_us_reports`)
    , properUrl = `https://casetext.com/search?q=554%20U.S.%20570`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`makes the proper url for a Federal case citation`, () => {
    const citations   = testCases.federal_case.all
    const results     = getUrls(citations, `federal_case`)
    const federalCase = findType(`federal_case`)
    const properUrls  = map(citations, (cite) => `${casetext.baseUrl}${urlEncode(Citation(cite, federalCase).mainCite)}`)

    expect(casetext.canHandle(`federal_case`)).toBe(true)
    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a docket number citation`, () => {
    const docketNumbers = [ `No. 13-7451`
                          , `No. 14-4321`
                          ]
    const properUrls = map(docketNumbers, cite => `${casetext.baseUrl}"${urlEncode(cite)}"`)

    expect(casetext.canHandle(`docket_number`)).toBe(true)
    expect(getUrls(docketNumbers, `docket_number`)).toEqual(properUrls)
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
    const properUrl = `https://casetext.com/search?q=2012%20WI%203`

    expect(jumpCiteResults).toEqual(replaceEach(jumpCiteResults, properUrl))
    expect(noJumpCiteResults).toEqual(jumpCiteResults)
  })
})

// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
