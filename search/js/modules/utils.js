var __slice = [].slice
, U         = {}

// Define a new function from fn1 and fn2 equivalent to fn2(fn1)
//
// An optional thisArg is provided in case the new function is being defined on
// an object and needs to be able to reference its properties with `this`:
// without providing it, `this` will refer to the global object.
U.after = function after(fn1, fn2, thisArg) {
  thisArg = thisArg || this

  return function() {
    return fn2.call(thisArg, fn1.apply(thisArg, arguments))
  }
}

U.extend = function extend () {
  var consumer  = arguments[0]
  , providers   = __slice.call(arguments, 1)
  , key
  , i
  , provider

  for (i = 0; i < providers.length; ++i) {
    provider = providers[i]

    for (key in provider) {
      if (provider.hasOwnProperty(key)) {
        consumer[key] = provider[key]
      }
    }
  }

  return consumer
}

U.escapeRegExp = function escapeRegExp(string){
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

U.curry = function curry(fn) {
  var arity = fn.length

  return function f1() {
    var args = __slice.call(arguments, 0)

    if (args.length >= arity) {
      return fn.apply(null, args)
    } else {
      return function f2() {
        var args2 = __slice.call(arguments, 0)

        return f1.apply(null, args.concat(args2))
      }
    }
  }
}

module.exports = U
