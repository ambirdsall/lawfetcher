// Define a new function from fn1 and fn2 equivalent to fn2(fn1)
//
// An optional thisArg is provided in case the new function is being defined on
// an object and needs to be able to reference its properties with `this`:
// without providing it, `this` will refer to the global object.
export default function compose(fn1, fn2, thisArg) {
  thisArg = thisArg || this

  return () => fn2.call(thisArg, fn1.apply(thisArg, arguments))
}
