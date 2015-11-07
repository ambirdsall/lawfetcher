describe('A citation', function() {
  // takes citationText and a type object
  var Citation    = require('../search/js/types/citation')
  , testType    = {
      name:            'test_type'
    , idPattern:       /test/i
    , mainCitePattern: /(.+), okay\?/
    }
  , validText   = 'this is a test, okay?'
  , invalidText = 'this is not'

  describe('A valid citation', function() {
    var valid = new Citation(validText, testType)

    it('knows the name of its type', function() {
      expect(valid.type).toBe('test_type')
    })

    it('can give the main citation with no jump cite', function() {
      expect(valid.mainCite).toBe('this is a test')
    })

    it('can give the jump cite without the rest of the citation', function() {
      expect(valid.jumpCite).toBe(', okay?')
    });

    it('can give the full citation', function() {
      expect(valid.fullCite).toBe(validText)
    })
  })

  describe('An invalid citation', function() {
    it('throws an error', function() {
      var fnWrapper = function() {
        return new Citation(invalidText, testType)
      }
      expect(fnWrapper).toThrow()
    })
  })
})
