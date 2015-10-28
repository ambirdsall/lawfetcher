var Citation = require('../types/citation');

module.exports = function detectType(taxonomy, citationText) {
  var len = taxonomy.length,
  i;

  for ( i = 0; i < len; ++i ) {
    if ( citationText.match(taxonomy[i].idPattern) ) {
      return new Citation(citationText, taxonomy[i]);
    }
  }
};
