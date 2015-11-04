var google = require('../../search/js/modules/source_list').filter(function(source) {
      return source.name === 'Google Search';
    }),
    types  = require('../../search/js/modules/type_list');

if ( google.length === 1 ) google = google[0];

describe('Google Search', function() {
  it('stores its baseUrl', function() {
    expect(google.baseUrl).toBe('http://google.com/search?q=');
  });

  xit('makes the proper url for a US Constitution citation', function() {
  });

  xit('makes the proper url for a Code of Federal Regulations citation', function() {
  });

  xit('makes the proper url for a United States Code citation', function() {
  });

  xit('makes the proper url for a Federal Rule of Appellate Procedure citation', function() {
  });

  xit('makes the proper url for a Federal Rule of Criminal Procedure citation', function() {
  });

  xit('makes the proper url for a Federal Rule of Civil Procedure citation', function() {
  });

  xit('makes the proper url for a Federal Rule of Evidence citation', function() {
  });

  xit('makes the proper url for a Federal Rule of Bankruptcy Procedure citation', function() {
  });

  xit('makes the proper url for a Federal case citation', function() {
  });

  xit('makes the proper url for a state constitution citation', function() {
  });

  xit('makes the proper url for a law/statute/code/rule citation', function() {
  });

  xit("makes the proper url for a citation that doesn't match any type", function() {
  });
});
