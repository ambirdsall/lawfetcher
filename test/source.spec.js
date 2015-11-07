var Source  = require('../search/js/types/source'),
    extend  = require('../search/js/modules/utils').extend;

describe('A source', function() {
  var foo = {
      type:     'foo'
    , mainCite: 'some'
    , jumpCite: ' stuff'
    , fullCite: 'some stuff'
    }
  , generic = {
      name:        'test_source'
    , baseUrl:     'http://butts.gov/'
    , canDeepLink: ['*']
    , anchor:      'needed for a source, but no need to test jQuery'
    , cannot:      ['the_truth']
    }

  it('can generate a formatted url with jump cite', function() {
    var canDeepLink = new Source(generic)

    expect(canDeepLink.url(foo)).toBe('http://butts.gov/some%20stuff')
  })

  it('can generate a formatted url without a jump cite', function() {
    var cannotDeepLink = extend(Object.create(generic), { canDeepLink: [] })
    , onlySome = new Source(cannotDeepLink)

    expect(onlySome.url(foo)).toBe('http://butts.gov/some')
  })

  it('can use jump cites with specific types', function() {
    var pickyConfig = extend(Object.create(generic), { canDeepLink: ['foo'] })
    , pickySource = new Source(pickyConfig)
    , bar = extend(Object.create(foo), { type: 'bar' })
  })

  it('can apply type-specific url formats', function() {
    var qux    = extend(Object.create(foo), {type: 'qux'})
    , tst    = {typeSpecificTreatments: {qux: function() { return 'something different' }}}
    , typist = new Source(extend(Object.create(generic), tst))

    expect(typist.url(foo)).toBe('http://butts.gov/some%20stuff')
    expect(typist.url(qux)).toBe('something different')
  })

  it('can opt out of specific types', function() {
    var kaffee = new Source(generic)

    expect(kaffee.canHandle('the_truth')).toBe(false)
    expect(kaffee.canHandle('foo')).toBe(true)
  })
})
