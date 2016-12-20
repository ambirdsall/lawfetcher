let U = {}

// Define a new function from fn1 and fn2 equivalent to fn2(fn1)
//
// An optional thisArg is provided in case the new function is being defined on
// an object and needs to be able to reference its properties with `this`:
// without providing it, `this` will refer to the global object.
U.after = require(`./utils/after`)

U.extend = require(`./utils/extend`)

// Used to compose functions, similar to a unix pipeline or the pipeline
// operator (`|>`) in languages like F#, OCaml, Elixir, and Elm.
//
// U.pipeline returns a new function which gets called with the appropriate
// arguments for the first function in the pipeline; the return value each
// method in the pipeline is used as the single argument of the next; the final
// argument's return value is the return value of the pipeline.
//
// Assuming accurately named functions that all take one argument,
//   (U.pipeline(add5, times10, Math.sqrt))(5)
//   10
U.pipeline      = require(`./utils/pipeline`)
U.escapeRegExp  = require(`./utils/escapeRegExp`)
U.matchAnyOf    = require(`./utils/matchAnyOf`)
U.matchAllOf    = require(`./utils/matchAllOf`)
U.curry         = require(`./utils/curry`)
U.requireFields = require(`./utils/requireFields`)
U.captureGroup  = require(`./utils/captureGroup`)

module.exports = U
