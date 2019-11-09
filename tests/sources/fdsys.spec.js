import { difference, isFunction, find, map } from 'lodash-es'
import { Source, Citation } from '../../js/types'
import { sources, citationTypes } from '../../js/data'
import testCases from '../data/test_cases'
import {
  getUrls as makeGetUrls,
  getUrl as makeGetUrl,
  replaceEach,
} from './source.spec.helpers'

const fdsysConfig = find(sources, (source) => source.name === `Federal Digital System`)
const fdsys       = new Source(fdsysConfig)
const getUrl      = makeGetUrl(fdsys, citationTypes)
const getUrls     = makeGetUrls(fdsys, citationTypes)
const urlEncode   = window.encodeURIComponent

describe(`Federal Digital System`, () => {
  it(`stores its baseUrl`, () => {
    expect(fdsys.baseUrl).toBe(`http://api.fdsys.gov/link`)
  })

  it(`has the expected _typeSpecificUrls`, () => {
    const allTypes     = citationTypes.map(t => t.typeId )
    const expectedTSTs = [`federal_register`]
    const fdsysTSTs    = allTypes.filter(function(typeName) { fdsys.hasOwnProperty(typeName) && isFunction(fdsys[typeName]) })

    expect(difference(fdsysTSTs, expectedTSTs)).toEqual([])
  })

  describe(`Unhandled citation types`, () => {
    it(`cannot handle a US Constitution citation`, () => {
      expect(fdsys.canHandle(`us_constitution`)).toBe(false)
    })

    it(`cannot handle a Code of Federal Regulations citation`, () => {
      expect(fdsys.canHandle(`cfr`)).toBe(false)
    })

    it(`cannot handle a United States Code citation`, () => {
      expect(fdsys.canHandle(`usc`)).toBe(false)
    })

    it(`cannot handle a Uniform Commercial Code citation`, () => {
      expect(fdsys.canHandle(`uniform_commercial_code`)).toBe(false)
    })

    it(`cannot handle a WL database citation`, () => {
      expect(fdsys.canHandle(`wl_database`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Appellate Procedure citation`, () => {
      expect(fdsys.canHandle(`frap`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Criminal Procedure citation`, () => {
      expect(fdsys.canHandle(`frcrmp`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Civil Procedure citation`, () => {
      expect(fdsys.canHandle(`frcp`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Evidence citation`, () => {
      expect(fdsys.canHandle(`fre`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Bankruptcy Procedure citation`, () => {
      expect(fdsys.canHandle(`frbp`)).toBe(false)
    })

    it(`cannot handle a US Reports citation`, () => {
      expect(fdsys.canHandle(`scotus_us_reports`)).toBe(false)
    })

    it(`cannot handle a Federal Case citation`, () => {
      expect(fdsys.canHandle(`federal_case`)).toBe(false)
    })

    it(`cannot handle a state constitution citation`, () => {
      expect(fdsys.canHandle(`state_constitution`)).toBe(false)
    })

    it(`cannot handle a Law Journal citation`, () => {
      expect(fdsys.canHandle(`law_journal`)).toBe(false)
    })

    it(`cannot handle a law/statute/code/rule citation`, () => {
      expect(fdsys.canHandle(`law_statute_code_rule`)).toBe(false)
    })

    it(`cannot handle a docket number citation`, () => {
      expect(fdsys.canHandle(`docket_number`)).toBe(false)
    })

    it("cannot handle a citation that doesn't match any type", () => {
      expect(fdsys.canHandle(`default`)).toBe(false)
    })
  })

  it(`makes the proper url for a Public Law citation`, () => {
    const citations = testCases.public_law.all
    const results = getUrls(citations, `public_law`)
    const congressNum = (c) => c.match(/(\d*)-\d*/)[1]
    const lawNum = (c) => c.match(/\d*-(\d*)/)[1]
    const toUrl = (cite) => `${fdsys.baseUrl}?collection=plaw&lawtype=public&congress=${congressNum(cite)}&lawnum=${lawNum(cite)}`
    const properUrls = map(citations, toUrl)

    expect(fdsys.canHandle(`public_law`)).toBe(true)
    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Statutes at Large citation`, () => {
    const citations = testCases.statutes_at_large.all
    const results = getUrls(citations, `statutes_at_large`)
    const volumeNum = (c) => c.match(/(\d*) stat/i)[1]
    const pageNum = (c) => c.match(/stat\.? ?(\d*)/i)[1]
    const toUrl = (cite) => `${fdsys.baseUrl}?collection=statute&volume=${volumeNum(cite)}&page=${pageNum(cite)}`
    const properUrls = map(citations, toUrl)

    expect(fdsys.canHandle(`statutes_at_large`)).toBe(true)
    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Register citation`, () => {
    const citations =
      [ `74 FR 43585`
      , `74 Fed. Reg. 43585`
      ]
    const results   = getUrls(citations, `federal_register`)
    const properUrl = `http://api.fdsys.gov/link?collection=fr&volume=74&page=43585`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`strips commas from Federal Register page numbers`, () => {
    const citation  = `75 FR 76,256`
    const properUrl = `http://api.fdsys.gov/link?collection=fr&volume=75&page=76256`
    const result    = getUrl(citation, `federal_register`)

    expect(result).toEqual(properUrl)
  })
})

// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
