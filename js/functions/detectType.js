import { curry } from '../utils'

// Why pass in the constructor as an argument? Clearly, `detectType` relies on
// the structure of the `Citation` function: note the arguments passed to the
// `constructor` argument. Problem is, the `Citation` constructor assigns
// `detectType` to its `from` method. This makes for a lovely API, but it also
// means one of three problematic things must be true:
//   1) '../types/citation' is imported to hardcode the obvious
//      dependency on `Citation` in `detectType.js` AND
//      '../functions/detectType' is imported in `citation.js`, which is
//      a circular dependency that breaks stuff. (TODO: is this actually true?)
//   2) `detectType` is defined in the same file as `Citation`, meaning it
//      cannot be tested in its current level of isolation. It can't be
//      imported into its own test file, and the `Citation.from` definition
//      prefills the `taxonomy` argument, meaning it cannot be tested as such
//      with any controls for the actual citation `type_list`.
//   3) the constructor is extracted to an argument even though only one value
//      makes any sense to be passed in.
// Of the available problems, I like 3) the best.
export default curry(function detectType(citationConstructor, taxonomy, citationText) {
  const len = taxonomy.length
  let i

  for ( i = 0; i < len; ++i ) {
    if ( citationText.match(taxonomy[i].idPattern) ) {
      return new citationConstructor(citationText, taxonomy[i])
    }
  }
})
