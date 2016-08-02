var lii       = require('../../search/js/modules/source_list')
      .filter(function(source) {
        return source.name === 'Cornell LII'
      })
, Source      = require('../../search/js/types/source')

if ( lii.length === 1 ) lii = new Source(lii[0])

var types     = require('../../search/js/modules/type_list')
, Citation    = require('../../search/js/types/citation')
, H           = require('./source.spec.helpers')
, getUrls     = H.getUrls(lii, types)
, replaceEach = H.replaceEach

describe('Cornell LII', function() {
  it('stores its baseUrl', function() {
    expect(lii.baseUrl).toBe('https://www.law.cornell.edu')
  })

  xit('makes the proper url for a US Constitution citation', function() {
  })

  xit('makes the proper url for a Code of Federal Regulations citation', function() {
  })

  xit('makes the proper url for a United States Code citation', function() {
  })


  it('makes the proper url for a Federal Rule of Appellate Procedure citation', function() {
    var citations = [
        'Federal Rules of Appellate Procedure 26.1(b)'
      , 'F.R.A.P. 26.1(b)'
      , 'Fed. R. App. Proc. 26.1(b)'
      , 'F.R. App. P. 26.1(b)'
      ]
    , results   = getUrls(citations, 'frap')
    , properUrl = 'https://www.law.cornell.edu/rules/frap/rule_26.1#rule_26.1_b'

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it('makes the proper url for a Federal Rule of Criminal Procedure citation', function() {
    var citations = [
        'Federal Rules of Criminal Procedure 52(b)'
      , 'Federal Rules of Crim. Proc. 52(b)'
      , 'F.R. Crim. P. 52(b)'
      ]
    , results   = getUrls(citations, 'frcrmp')
    , properUrl = 'https://www.law.cornell.edu/rules/frcrmp/rule_52#rule_52_b'

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it('makes the proper url for a Federal Rule of Civil Procedure citation', function() {
    var citations = [
        'Federal Rules of Civil Procedure 26(a)(1)(B)'
      , 'Fed. Rules Civ. Proc. 26(a)(1)(B)'
      , 'Fed. R. Civ. P. 26(a)(1)(B)'
      , 'F.R. Civ. P. 26(a)(1)(B)'
      , 'F.R.C.P. 26(a)(1)(B)'
      , 'FRCP 26(a)(1)(B)'
      ]
    , results = getUrls(citations, 'frcp')
    , properUrl = 'https://www.law.cornell.edu/rules/frcp/rule_26#rule_26_a_1_B'

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it('makes the proper url for a Federal Rule of Evidence citation', function() {
    var citations = [
        'Federal Rules of Evidence 801(d)(2)'
      , 'F.R. Evid. 801(d)(2)'
      , 'F.R.E. 801(d)(2)'
      , 'FRE 801(d)(2)'
      ]
    , results   = getUrls(citations, 'fre')
    , properUrl = 'https://www.law.cornell.edu/rules/fre/rule_801#rule_801_d_2'

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it('makes the proper url for a Federal Rule of Bankruptcy Procedure citation', function() {
    var citations = [
        'Federal Rules of Bankruptcy Procedure 1007(b)(1)'
      , 'Fed.R. Bankr. P. 1007(b)(1)'
      , 'Fed. Rules Bankr. Proc. 1007(b)(1)'
      , 'Fed. Rules Bankr. Proc. Rule 1007(b)(1)'
      ]
    , results   = getUrls(citations, 'frbp')
    , properUrl = 'https://www.law.cornell.edu/rules/frbp/rule_1007#rule_1007_b_1'

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  xit('makes the proper url for a Federal case citation', function() {
  })

  xit('makes the proper url for a state constitution citation', function() {
  })

  xit('makes the proper url for a law/statute/code/rule citation', function() {
  })

  xit("makes the proper url for a citation that doesn't match any type", function() {
  })
})
