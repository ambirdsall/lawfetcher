module.exports = function curry(fn) {
  const arity = fn.length

  return function f1(...args) {
    if (args.length >= arity) {
      return fn.apply(null, args)
    } else {
      return function f2(...args2) {
        return f1.apply(null, args.concat(args2))
      }
    }
  }
}
