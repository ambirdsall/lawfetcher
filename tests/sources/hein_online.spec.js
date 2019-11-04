import { find, map } from 'lodash-es'
import { Source, Citation } from '../../js/types'
import { sources, citationTypes } from '../../js/data'
import testCases from '../data/test_cases'
import {
  findType as makeFindType,
  getUrls as makeGetUrls,
  replaceEach,
} from './source.spec.helpers'

const heinOnlineConfig = find(sources, (source) => source.name === `HeinOnline`)
const heinOnline       = new Source(heinOnlineConfig)
const getUrl           = getUrl(heinOnline, citationTypes)
const getUrls          = getUrls(heinOnline, citationTypes)
const findType         = makeFindType(citationTypes)
const urlEncode        = window.encodeURIComponent

describe(`HeinOnline`, () => {
  it(`stores its baseUrl`, () => {
    expect(heinOnline.baseUrl).toBe(`http://www.heinonline.org/HOL/OneBoxCitation?&collection=journals&base=js&cit_string=`)
  })

  it(`cannot handle a US Constitution citation`, () => {
    expect(heinOnline.canHandle(`us_constitution`)).toBe(false)
  })

  it(`cannot handle a Code of Federal Regulations citation`, () => {
    expect(heinOnline.canHandle(`cfr`)).toBe(false)
  })

  it(`cannot handle a United States Code citation`, () => {
    expect(heinOnline.canHandle(`usc`)).toBe(false)
  })

  it(`cannot handle a Uniform Commercial Code citation`, () => {
    expect(heinOnline.canHandle(`uniform_commercial_code`)).toBe(false)
  })

  it(`makes the proper url for a Public Law citation`, () => {
    expect(heinOnline.canHandle(`public_law`)).toBe(false)
  })

  it(`makes the proper url for a Statutes at Large citation`, () => {
    expect(heinOnline.canHandle(`statutes_at_large`)).toBe(false)
  })

  it(`makes the proper url for a Federal Register citation`, () => {
    expect(heinOnline.canHandle(`federal_register`)).toBe(false)
  })

  it(`cannot handle a Federal Rule of Appellate Procedure citation`, () => {
    expect(heinOnline.canHandle(`frap`)).toBe(false)
  })

  it(`cannot handle a Federal Rule of Criminal Procedure citation`, () => {
    expect(heinOnline.canHandle(`frcrmp`)).toBe(false)
  })

  it(`cannot handle a Federal Rule of Civil Procedure citation`, () => {
    expect(heinOnline.canHandle(`frcp`)).toBe(false)
  })

  it(`cannot handle a Federal Rule of Evidence citation`, () => {
    expect(heinOnline.canHandle(`fre`)).toBe(false)
  })

  it(`cannot handle a Federal Rule of Bankruptcy Procedure citation`, () => {
    expect(heinOnline.canHandle(`frbp`)).toBe(false)
  })

  it(`cannot handle a US Reports citation`, () => {
    expect(heinOnline.canHandle(`scotus_us_reports`)).toBe(false)
  })

  it(`cannot handle a Federal Case citation`, () => {
    expect(heinOnline.canHandle(`federal_case`)).toBe(false)
  })

  it(`cannot handle a state constitution citation`, () => {
    expect(heinOnline.canHandle(`state_constitution`)).toBe(false)
  })

  it(`makes the proper url for a Law Journal citation`, () => {
    const citations    = testCases.law_journal.all
    const results      = getUrls(citations, `law_journal`)
    const law_journal  = findType(`law_journal`)
    const expectedUrls = map(citations, cite => `${heinOnline.baseUrl}${urlEncode(Citation(cite, law_journal).fullCite)}`)

    expect(heinOnline.canHandle(`law_journal`)).toBe(true)
    expect(results).toEqual(expectedUrls)
  })

  it(`cannot handle a law/statute/code/rule citation`, () => {
    expect(heinOnline.canHandle(`law_statute_code_rule`)).toBe(false)
  })

  it("cannot handle a citation that doesn't match any type", () => {
    expect(heinOnline.canHandle(`default`)).toBe(false)
  })
})

// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
