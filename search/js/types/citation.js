var $      = require('jquery'),
    extend = $.extend,
    trim   = $.trim;

module.exports = function Citation(citationText, type) {
  var mainCite,
      jumpCite,
      matchData;

  // mainCitePatterns find matches, perhaps counter-intuitively, against the given
  // type's jump cite; everything before the jump cite is put in a capture group
  // so that the jump cite can be optionally stripped by Sources
  if ( matchData = citationText.match(type.mainCitePattern) ) {

    // the default type checks against two jump cite patterns; it will have one
    // string and 1 undefined as matchData[1] & matchData[2], arbitrarily ordered
    mainCite = matchData[1] || matchData[2];
    jumpCite = citationText.slice(mainCite.length);
  } else { // i.e. if there is no detectable jump cite
    mainCite = citationText;
    jumpCite = "";
  }

  extend(this, {
    type: type.name,
    mainCite: trim(mainCite),
    jumpCite: jumpCite,
    fullCite: citationText,
    subtypes: type.subtypes || null
  });
};

