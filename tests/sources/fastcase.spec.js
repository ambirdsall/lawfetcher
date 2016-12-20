const _              = require(`lodash`)
const Source         = require(`../../js/types/source`)
const Citation       = require(`../../js/types/citation`)
const fastcaseConfig = _.find(require(`../../js/data/source_list`), (source) => source.name === `Fastcase`)
const fastcase       = new Source(fastcaseConfig)
const types          = require(`../../js/data/type_list`)
const testCases      = require(`../data/test_cases`)
const H              = require(`./source.spec.helpers`)
const getUrls        = H.getUrls(fastcase, types)
const replaceEach    = H.replaceEach
const urlEncode      = window.encodeURIComponent

describe(`Fastcase Search`, () => {
  it(`stores its baseUrl`, () => {
    expect(fastcase.baseUrl).toBe(`https://permafrast.herokuapp.com/`)
  })

  it(`has the expected _typeSpecificUrls`, () => {
    var allTypes = types.map(function(t) { return t.typeId })
      , expectedTSTs = [`federal_case`]
      , fastcaseTSTs = allTypes.filter(function(typeName) { fastcase.hasOwnProperty(typeName) && _.isFunction(fastcase[typeName]) })

    expect(_.difference(fastcaseTSTs, expectedTSTs)).toEqual([])
  })

  describe(`Unhandled citation types`, () => {
    it(`cannot handle a US Constitution citation`, () => {
      expect(fastcase.canHandle(`us_constitution`)).toBe(false)
    })

    it(`cannot handle a Code of Federal Regulations citation`, () => {
      expect(fastcase.canHandle(`cfr`)).toBe(false)
    })

    it(`cannot handle a United States Code citation`, () => {
      expect(fastcase.canHandle(`usc`)).toBe(false)
    })

    it(`cannot handle a Uniform Commercial Code citation`, () => {
      expect(fastcase.canHandle(`uniform_commercial_code`)).toBe(false)
    })

    it(`cannot handle a WL database citation`, () => {
      expect(fastcase.canHandle(`wl_database`)).toBe(false)
    })

    it(`cannot handle a Public Law citation`, () => {
      expect(fastcase.canHandle(`public_law`)).toBe(false)
    })

    it(`cannot handle a Statutes at Large citation`, () => {
      expect(fastcase.canHandle(`statutes_at_large`)).toBe(false)
    })

    it(`cannot handle a Federal Register citation`, () => {
      expect(fastcase.canHandle(`federal_register`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Appellate Procedure citation`, () => {
      expect(fastcase.canHandle(`frap`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Criminal Procedure citation`, () => {
      expect(fastcase.canHandle(`frcrmp`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Civil Procedure citation`, () => {
      expect(fastcase.canHandle(`frcp`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Evidence citation`, () => {
      expect(fastcase.canHandle(`fre`)).toBe(false)
    })

    it(`cannot handle a Federal Rule of Bankruptcy Procedure citation`, () => {
      expect(fastcase.canHandle(`frbp`)).toBe(false)
    })

    it(`cannot handle a US Reports citation`, () => {
      expect(fastcase.canHandle(`scotus_us_reports`)).toBe(false)
    })

    it(`cannot handle a Federal case citation`, () => {
      expect(fastcase.canHandle(`federal_case`)).toBe(false)
    })

    it(`cannot handle a state constitution citation`, () => {
      expect(fastcase.canHandle(`state_constitution`)).toBe(false)
    })

    it(`cannot handle a Law Journal citation`, () => {
      expect(fastcase.canHandle(`law_journal`)).toBe(false)
    })

    it(`cannot handle a law/statute/code/rule citation`, () => {
      expect(fastcase.canHandle(`law_statute_code_rule`)).toBe(false)
    })

    it(`cannot handle a docket number citation`, () => {
      expect(fastcase.canHandle(`docket_number`)).toBe(false)
    })

    it("cannot handle a citation that doesn't match any type", () => {
      expect(fastcase.canHandle(`default`)).toBe(false)
    })
  })

  // Permafrast has been responding to a number of legitimate citations with
  // `Internal Server Error`, so although the link building remains under test
  // coverage, right now this type (and, in fact, every other) is NOT handled
  it(`makes the proper url for a Federal case citation`, () => {
      var citations = [
        `500 F.3d 342`
      , `500 F. 3d 342`
      , `500 F. 3d 342, 345`
      , `500 F. 3d 342, 345-350`
      , `500 F. 3d 342, 345-50`
      ]
    , results   = getUrls(citations, `federal_case`)
    , properUrl = `https://permafrast.herokuapp.com/500/F.3d/342/redirect`

    expect(results).toEqual(replaceEach(results, properUrl))
  })
})



// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
