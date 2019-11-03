import { reduce } from 'lodash-es'
import { escapeRegExp } from '.'

function orCombiner(acc, pattern) {
  let next
  if ( pattern instanceof RegExp ) next = pattern.source
  if ( typeof pattern === `string` ) next = escapeRegExp(pattern)
  if (! next ) throw `${pattern} not a String or a RegExp`

  // Slightly hacky special case for first iteration. See below.
  if ( acc instanceof NullPattern ) return RegExp(next)

  let patternSoFar
  if ( acc instanceof RegExp ) patternSoFar = acc.source
  if ( patternSoFar == null ) throw `${acc} not a String or a RegExp`

  return RegExp(`${patternSoFar}|${next}`)
}

// So it happens that, if a custom accumulator isn't specified, single-element
// instances of `list` seem to short-circuit the coercian into RegExp.
//
// This isn't always wrong: given a regex, it returns a regex (100%
// correct); but given a string, it returns a string.  Now
// String.prototype.match("some string") attempts to match the string
// literally, which is the desired behavior. But given the explicit contract to
// return a regex, the string option feels hacky, and would be a very annoying
// bug to track down were code to change around it in a way that raised errors
// given a string.
//
// The obvious first option, a "blank" regex a la `RegExp()` doesn't work: sans
// argument, the RegExp constructor returns an empty non-capture group, like
// `/(?:)/`. And then everything is ruined, since a pattern starting with
// `/(?:)|/` will match literally every string.
//
// So NullPattern is just a semantic name to feed `instanceof` to provide an
// escape hatch for an edge case.
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
export default function matchAnyOf(...list) {
  return reduce(list, orCombiner, new NullPattern())
}
