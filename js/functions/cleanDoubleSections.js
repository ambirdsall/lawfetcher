// if there's a double section followed by stuff, a comma, and then more stuff,
// remove the comma and that which follows (i.e. for "§§ 123-125" => "§ 123";
// similar w/ "§§ 123, 125"
export default function cleanDoubleSections(citation) {
  if ( /\u00a7{2}/.test(citation) ) {
    // Given a string like /§§.+,.+/, it attempts to strip compound citation
    // down to single citation by only keeping the characters from (inclusive)
    // the second § to the character before the comma. Failing that, it replaces
    // any "§§" with "§".
    return citation.replace(/\u00a7(\u00a7 ?[^,]+),.+/, `$1`)
                   .replace(/\u00a7{2}/, `§`)
  } else {
    return citation
  }
}

