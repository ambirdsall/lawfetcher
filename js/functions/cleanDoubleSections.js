// if there's a double section followed by stuff, a comma, and then more stuff,
// remove the comma and that which follows (i.e. for "SS 123-125" => "S 123";
// similar w/ "SS 123, 125"
module.exports = function cleanDoubleSections(citation) {
  if ( /\u00a7{2}/.test(citation) ) {
    // attempts to strip compound citation down to single citation by only
    // keeping the characters from the second § to the character before the
    // comma from /§§.+,.+/
    // Failing that, it simply replaces the double § with a single one
    return citation.replace(/\u00a7(\u00a7 ?[^,]+),.+/, `$1`)
                   .replace(/\u00a7{2}/, `§`)
  } else {
    return citation
  }
}

