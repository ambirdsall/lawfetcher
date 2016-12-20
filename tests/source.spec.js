const _      = require(`lodash`)
const Source = require(`../js/types/source`)
const extend = require(`../js/utils/extend`)

describe(`A source`, () => {
  const fooCitation = {
          type:     `foo`
        , mainCite: `some`
        , jumpCite: ` stuff`
        , fullCite: `some stuff`
        }
  const generic = {
          name:               `test_source`
        , baseUrl:            `http://butts.gov/`
        , _deepLinkableTypes: [`*`]
        , $anchor:            `needed for a real source, but we're not testing jQuery`
        , _cannot:            [`the_truth`]
        }

  it(`requires its config object to have certain fields`, () => {
    const required = [`name`, `baseUrl`, `_deepLinkableTypes`, `$anchor`, `_cannot`]
    // each member of invalidConfigs is missing a single required field
    const invalidConfigs = _.map(required, (field) => {
            let invalid = extend({}, generic)
            delete invalid[field]
            return invalid
          })
    const instantiateWith = (config) => Source(config)
    const instantiatingValid = instantiateWith.bind(this, generic)

    _.each(invalidConfigs, (invalid) => {
      const instantiatingInvalid = instantiateWith.bind(this, invalid)

      expect(instantiatingInvalid).toThrow()
    })

    expect(instantiatingValid).not.toThrow()
  })

  it(`can generate a formatted url with jump cite`, () => {
    const canDeepLink = Source(generic)

    expect(canDeepLink.url(fooCitation)).toBe(`http://butts.gov/some%20stuff`)
  })

  it(`can generate a formatted url without a jump cite`, () => {
    const cannotDeepLink = extend(Object.create(generic), { _deepLinkableTypes: [] })
    const onlySome = Source(cannotDeepLink)

    expect(onlySome.url(fooCitation)).toBe(`http://butts.gov/some`)
  })

  it(`can use jump cites with some types and not with others`, () => {
    const pickyConfig = extend(Object.create(generic), { _deepLinkableTypes: [`foo`] })
    const pickySource = Source(pickyConfig)
    const bar = extend(Object.create(fooCitation), { type: `bar` })

    expect(pickySource.url(fooCitation)).toBe(`http://butts.gov/some%20stuff`)
    expect(pickySource.url(bar)).toBe(`http://butts.gov/some`)
  })

  it(`can supply a custom url method with _url`, () => {
    const customUrlConfig = extend(Object.create(generic), {_url: (cite) => `custom url`})
    const customUrlSource = Source(customUrlConfig)

    expect(customUrlSource.url(fooCitation)).toBe(`custom url`)
  })

  it(`can apply type-specific url formats`, () => {
    const qux    = extend(Object.create(fooCitation), {type: `qux`})
    const tsu    = {_typeSpecificUrls: {qux: function() { return `something different` }}}
    const typist = Source(extend(Object.create(generic), tsu))

    expect(typist.url(fooCitation)).toBe(`http://butts.gov/some%20stuff`)
    expect(typist.url(qux)).toBe(`something different`)
  })

  it(`can opt out of specific types`, () => {
    const lieutenantKaffee = Source(generic)

    expect(lieutenantKaffee.canHandle(`the_truth`)).toBe(false)
    expect(lieutenantKaffee.canHandle(`foo`)).toBe(true)
  })
})
