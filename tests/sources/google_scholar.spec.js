var google_scholar = require('../../search/js/modules/source_list')
    .filter(function(source) {
      return source.name === 'Google Scholar'
    })
, Source      = require('../../search/js/types/source')

if ( google_scholar.length === 1 ) google_scholar = google_scholar[0]

var types     = require('../../search/js/modules/type_list')
, Citation    = require('../../search/js/types/citation')
, H           = require('./source.spec.helpers')
, getUrls     = H.getUrls(google_scholar)
, findType    = H.findType
, replaceEach = H.replaceEach

describe('Google Scholar', function() {
  it('stores its baseUrl', function() {
    expect(google_scholar.baseUrl).toBe('https://scholar.google.com/scholar?as_sdt=2006&hl=en&q=')
  })

  xit('makes the proper url for a US Constitution citation', function() {
  })

  xit('makes the proper url for a Code of Federal Regulations citation', function() {
  })

  xit('makes the proper url for a United States Code citation', function() {
    var citations = [
        '123 U.S.C. § 2000e-2(a)'
      ]
    , results   = getUrls(citations, types, 'usc')
    , properUrl = 'https://scholar.google.com/scholar?as_sdt=2006&hl=en&q=%22123%20U.S.C.%20%C2%A7%202000e-2(a)%22'

    expect(results).toEqual(replaceEach(results, properUrl))
  })

  xit('makes the proper url for a Federal Rule of Appellate Procedure citation', function() {
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
