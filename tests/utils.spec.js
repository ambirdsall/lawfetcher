describe('The utils object', function() {
  var U = require('../search/js/modules/utils')

  it('can extend objects', function() {
    var baseObj = {old: true}
    , mixin   = {new: true}

    U.extend(baseObj, mixin)

    expect(baseObj).toEqual({old: true, new: true})
  })

  it('can escape special characters for regex', function() {
    expect(U.escapeRegExp('?')).toBe('\\?')
  })

  it('can compose functions', function() {
    var f = function addThree(x) { return x + 3; }
    , g = function timesTwo(y) { return y * 2; }
    , effOfGee = U.after(g, f).call(this, 0)

    expect(effOfGee).toBe( f(g(0)) )
    expect(effOfGee).not.toBe( g(f(0)) )
  })

  it('can curry functions', function() {
    var addOne = U.curry(function add(x, y) { return x + y; })(1)

    expect(addOne(5)).toEqual(6)
  })
})
