var google    = require('../../search/js/modules/source_list')
    .filter(function(source) {
      return source.name === 'Google Search'
    })
, Source      = require('../../search/js/types/source')

if ( google.length === 1 ) google = google[0]

var types     = require('../../search/js/modules/type_list')
, Citation    = require('../../search/js/types/citation')
, H           = require('./source.spec.helpers')
, getUrls     = H.getUrls(google)
, findType    = H.findType
, replaceEach = H.replaceEach

describe('Google Search', function() {
  it('stores its baseUrl', function() {
    expect(google.baseUrl).toBe('http://google.com/search?q=')
  })

  xit('makes the proper url for a US Constitution citation', function() {
  })

  xit('makes the proper url for a Code of Federal Regulations citation', function() {
  })

  it('makes the proper url for a United States Code citation', function() {
    var citations = [
        '123 U.S.C. § 2000e-2(a)'
      ]
    , results   = getUrls(citations, types, 'usc')
    , properUrl = 'http://google.com/search?q=123%20U.S.C.%20%C2%A7%202000e-2(a)'

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  it('makes the proper url for a Federal Rule of Appellate Procedure citation', function() {
    var citations = [
        'Federal Rules of Appellate Procedure 26.1(b)'
      ]
    , results   = getUrls(citations, types, 'frap')
    , properUrl = 'http://google.com/search?q=Federal%20Rules%20of%20Appellate%20Procedure%2026.1(b)'

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  xit('makes the proper url for a Federal Rule of Criminal Procedure citation', function() {
  })

  xit('makes the proper url for a Federal Rule of Civil Procedure citation', function() {
  })

  xit('makes the proper url for a Federal Rule of Evidence citation', function() {
  })

  xit('makes the proper url for a Federal Rule of Bankruptcy Procedure citation', function() {
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
