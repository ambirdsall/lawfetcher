const _           = require(`lodash`)
const Source      = require(`../../js/types/source`)
const Citation    = require(`../../js/types/citation`)
const liiConfig   = _.find(require(`../../js/data/source_list`), (source) => source.name === `LII`)
const lii         = new Source(liiConfig)
const types       = require(`../../js/data/type_list`)
const testCases   = require(`../data/test_cases`)
const H           = require(`./source.spec.helpers`)
const getUrls     = H.getUrls(lii, types)
const replaceEach = H.replaceEach
const findType    = H.findType(types)
const urlEncode   = window.encodeURIComponent

describe(`Cornell LII`, () => {
  it(`stores its baseUrl`, () => {
    expect(lii.baseUrl).toBe(`https://www.law.cornell.edu`)
  })

  it(`has the expected _typeSpecificUrls`, () => {
    var allTypes = types.map(function(t) { return t.name })
      , expectedTSTs = [
          `us_constitution`
        , `cfr`
        , `usc`
        , `frap`
        , `frcp`
        , `frcrmp`
        , `frbp`
        , `fre`
        , `scotus_us_reports`
        ]
      , liiTSTs = allTypes.filter(function(typeName) { lii.hasOwnProperty(typeName) && _.isFunction(lii[typeName]) })

    expect(_.difference(liiTSTs, expectedTSTs)).toEqual([])
  })

  describe(`Unhandled citation types`, () => {
    it(`cannot handle a WL database citation`, () => {
      expect(lii.canHandle(`wl_database`)).toBe(false)
    })

    it(`cannot handle a Public Law citation`, () => {
      expect(lii.canHandle(`public_law`)).toBe(false)
    })

    it(`cannot handle a Statutes at Large citation`, () => {
      expect(lii.canHandle(`statutes_at_large`)).toBe(false)
    })

    it(`cannot handle a Federal Register citation`, () => {
      expect(lii.canHandle(`federal_register`)).toBe(false)
    })

    it(`cannot handle a Federal case citation`, () => {
      expect(lii.canHandle(`federal_case`)).toBe(false)
    })

    it(`cannot handle a state constitution citation`, () => {
      expect(lii.canHandle(`state_constitution`)).toBe(false)
    })

    it(`cannot handle a Law Journal citation`, () => {
      expect(lii.canHandle(`law_journal`)).toBe(false)
    })

    it(`cannot handle a law/statute/code/rule citation`, () => {
      expect(lii.canHandle(`law_statute_code_rule`)).toBe(false)
    })

    it(`cannot handle a docket number citation`, () => {
      expect(lii.canHandle(`docket_number`)).toBe(false)
    })

    it("cannot handle a citation that doesn't match any type", () => {
      expect(lii.canHandle(`default`)).toBe(false)
    })
  })

  it(`makes the proper url for a US Constitution citation`, () => {
    var citations = [
          `U.S. CONST. art. I, § 7, cl. 1`
        , `U.S. Const. amend. XIV, § 1`
        ]
      , urls = [
          `https://www.law.cornell.edu/constitution/articleI#section7`
        , `https://www.law.cornell.edu/constitution#section1`
        ]

    expect(getUrls(citations, `us_constitution`)).toEqual(urls)
  })

  it(`makes the proper url for a Code of Federal Regulations citation`, () => {
    const citations  = testCases.cfr.all
    const results    = getUrls(citations, `cfr`)
    const properUrls = [ `https://www.law.cornell.edu/cfr/text/45/147.130#a_iv`
                       , `https://www.law.cornell.edu/cfr/text/45/147.130#a_1_iv`
                       , `https://www.law.cornell.edu/cfr/text/40/61.145#c_6_i`
                       , `https://www.law.cornell.edu/cfr/text/40/763.90#i_2_i`
                       , `https://www.law.cornell.edu/cfr/text/46/292`
                       , `https://www.law.cornell.edu/cfr/text/20/404.1520`
                       , `https://www.law.cornell.edu/cfr/text/20/404.929`
                       ]

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a United States Code citation`, () => {
    var citations = [
        `17 USC 101`
      , `17 U.S.C. 101`
      , `17 U. S. C. 101`
      ]
    , results   = getUrls(citations, `usc`)
    , properUrl = `https://www.law.cornell.edu/uscode/text/17/101`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`makes the proper url for a Uniform Commercial Code citation`, () => {
    const citations               = testCases.uniform_commercial_code.all
    const results                 = getUrls(citations, `uniform_commercial_code`)
    const uniform_commercial_code = findType(`uniform_commercial_code`)
    const articleNumber           = (c) => c.match(/(\d)-\d+/) && c.match(/(\d)-\d+/)[1]
    const sectionNumber           = (c) => c.match(/\d-(\d+)/) && c.match(/\d-(\d+)/)[1]
    const properUrls              = _.map(citations, (cite) => `${lii.baseUrl}/ucc/${articleNumber(cite)}/${articleNumber(cite)}-${sectionNumber(cite)}`)

    expect(results).toEqual(properUrls)
  })

  it(`makes the proper url for a Federal Rule of Appellate Procedure citation`, () => {
    var citations = [
        `Federal Rules of Appellate Procedure 26.1(b)`
      , `F.R.A.P. 26.1(b)`
      , `Fed. R. App. Proc. 26.1(b)`
      , `F.R. App. P. 26.1(b)`
      ]
    , results   = getUrls(citations, `frap`)
    , properUrl = `https://www.law.cornell.edu/rules/frap/rule_26.1#rule_26.1_b`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`makes the proper url for a Federal Rule of Criminal Procedure citation`, () => {
    var citations = [
        `Federal Rules of Criminal Procedure 52(b)`
      , `Federal Rules of Crim. Proc. 52(b)`
      , `F.R. Crim. P. 52(b)`
      ]
    , results   = getUrls(citations, `frcrmp`)
    , properUrl = `https://www.law.cornell.edu/rules/frcrmp/rule_52#rule_52_b`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`makes the proper url for a Federal Rule of Civil Procedure citation`, () => {
    var citations = [
        `Federal Rules of Civil Procedure 26(a)(1)(B)`
      , `Fed. Rules Civ. Proc. 26(a)(1)(B)`
      , `Fed. R. Civ. P. 26(a)(1)(B)`
      , `F.R. Civ. P. 26(a)(1)(B)`
      , `F.R.C.P. 26(a)(1)(B)`
      , `FRCP 26(a)(1)(B)`
      ]
    , results = getUrls(citations, `frcp`)
    , properUrl = `https://www.law.cornell.edu/rules/frcp/rule_26#rule_26_a_1_B`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`makes the proper url for a Federal Rule of Evidence citation`, () => {
    var citations = [
        `Federal Rules of Evidence 801(d)(2)`
      , `F.R. Evid. 801(d)(2)`
      , `F.R.E. 801(d)(2)`
      , `FRE 801(d)(2)`
      ]
    , results   = getUrls(citations, `fre`)
    , properUrl = `https://www.law.cornell.edu/rules/fre/rule_801#rule_801_d_2`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`makes the proper url for a Federal Rule of Bankruptcy Procedure citation`, () => {
    var citations = [
        `Federal Rules of Bankruptcy Procedure 1007(b)(1)`
      , `Fed.R. Bankr. P. 1007(b)(1)`
      , `Fed. Rules Bankr. Proc. 1007(b)(1)`
      , `Fed. Rules Bankr. Proc. Rule 1007(b)(1)`
      ]
    , results   = getUrls(citations, `frbp`)
    , properUrl = `https://www.law.cornell.edu/rules/frbp/rule_1007#rule_1007_b_1`

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it(`makes the proper url for a Supreme Court US Reports citation`, () => {
    var citations = [
        `554 US 570`
      , `554 U.S. 570`
      , `554 U. S. 570`
      ]
    , results   = getUrls(citations, `scotus_us_reports`)
    , properUrl = `https://www.law.cornell.edu/supremecourt/text/554/570`

    expect(results).toEqual(replaceEach(results, properUrl))
  })
})

// vim:foldmethod=marker:foldmarker={,}:foldlevel=1
