import { reduce } from 'lodash-es'
import escapeRegExp from './escapeRegExp'

function andCombiner(acc, pattern) {
  let next
  if ( pattern instanceof RegExp ) next = pattern.source
  if ( typeof pattern === `string` ) next = escapeRegExp(pattern)
  if (! next ) throw `${pattern} not a String or a RegExp`

  // Slightly hacky special case for first iteration
  if ( acc instanceof NullPattern ) return RegExp(`(?:${next})`)

  let patternSoFar
  if ( acc instanceof RegExp ) patternSoFar = acc.source
  if ( patternSoFar == null ) throw `${acc} not a String or a RegExp`

  return RegExp(`${patternSoFar}(?:${next})`)
}

// If you're curious, there's a long comment explaining this towards the bottom
// of js/utils/matchAnyOf.js
function NullPattern(){}

// Takes any number of strings or regexes as arguments
// Returns a new regex pattern which matches any of its arguments
//
// Note: because of the way the regular expressions get combined, flags are
// discarded. The main annoyance this causes is with case-sensitivity: because
// it's impossible to give flags to only one sub-pattern, case-insensitive
// matches have to be specified for each individual letter, as:
//    /[Cc]ase [Ii]nsensitive/
// or worse,
//    /[Hh][Tt][Mm][Ll]/
export default function matchAllOf(...list) {
  return reduce(list, andCombiner, new NullPattern())
}
