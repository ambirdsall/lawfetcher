// filter a jQuery object by regex and apply cssClass to all matching
//   members
// returns the non-matching subset to allow chaining
$.fn.filterOutAndClassify = function(regex, cssClass) {
  // outer `this` refers to $setOfElements
  // inner `this` refers to $setOfElements[i] (DOM element, not jQuery wrapped)
  this.filter(function(i) {
    return $(this).text().match(regex);
  }).addClass(cssClass);

  return this.filter(function(i) {
    return !($(this).text().match(regex))
  })
}

// a generic filter, taking a jQuery obj and allowing chaining on the remainder
//
// fnArgs is an array or array-like structure
$.fn.filterOutAndTreat = function(regex, fn, fnArgs) {
  var filtered,
      theRest;
  
  // filter out group for treatment
  filtered = this.filter(function() {
    return $(this).text().match(regex);
  })
  theRest = this.filter(function() {
    return !($(this).text().match(regex));
  })

  // apply treatment
  fn.apply(filtered, fnArgs);
  // and return the rest
  return theRest;
}

function highlightMainCitation(cssClass, jumpCiteRegex) {
  // deal with a filtered out citation type
  var matchData,
      mainCite,
      jumpCite,
      fullText;

  // outer `this` is the set of jQuery objects
  // inner `this` is the DOM elements contained in one such object
  this.each(function(i, value) {
    fullText = $(this).html();
      // matchData[0] is the full match;
      // matchData[1] is the capture group, in this case everything which
      // comes before the ', cl.', i.e. citation less jump cite
    if (matchData = fullText.match(jumpCiteRegex)) {
      // the final check against two patterns will have one string and one
      // undefined as matchData[1] and matchData[2], arbitrarily ordered
      mainCite = matchData[1] || matchData[2];
      // console.log(fullText)
      // console.log(mainCite)
      // console.log()
      jumpCite = fullText.slice(mainCite.length);

      $(this).html("<span class='" + cssClass + "'>" + mainCite + "</span>" + jumpCite);
    } else {
      $(this).html("<span class='" + cssClass + "'>" + fullText + "</span>");
    }
  });
}

$.fn.highlightMainCitation = highlightMainCitation;

function determineCitationType($set) {
       // US Const
  $set.filterOutAndTreat(/U\.?S\.? Const/i,
        highlightMainCitation , ["test-1", /(.+), cl\./])
       // C.F.R. || U.S.C.
      .filterOutAndTreat(/(?:C\.? ?F\.? ?R\.?)|(?:U\.? ?S\.? ?C\.?)/i,
        highlightMainCitation, ["test-2", /([^\(]+)(?:\s*\(.\))+/])
       // F(ed(eral)) R(ule(s))
      .filterOutAndTreat(/^F(?:(?:ed(?:\.|eral) )|\. ?)?R(?:(?:ules?)|\.?)/,
          highlightMainCitation, ["test-3", /([^\(]+)(?:\s*\(.\))+/])
       // federal case law
      .filterOutAndTreat(/\d{1,5} (?:U\.? ?S\.?|S\. ?Ct\.|F\.(?:Supp\.?)?(?:\dd)?) d{1,5}/i,
          // some federal case citations have, e.g. '(2006)' following jump cite
          // (if present)
          highlightMainCitation, ["test-4", /(.+\d{1,5})(?:, ?\d{1,5})/])
       // State Consts
      .filterOutAndTreat(/Const/i,
          highlightMainCitation, ["test-5", /(.*(?:section|\u00a7) ?[\d\.]+).+/i])
       // Laws || Stat. || Code || Regs || Rule
      .filterOutAndTreat(/(?:laws?)|(?:stat\.?)|(?:code)|(?:regs\.?)|(?:rule)/i,
          highlightMainCitation, ["test-6", /([^\(]+)(?:\s*\(.\))+/])
       // default
      .highlightMainCitation("test-7", /(?:(.+\d+)(?:, ?\d+))|(?:([^\(]+)(?:\s*\(.\))+)/)
}

var testCases = $(".citation"),
    results,
    newTestButton;

newTestButton = $("#submit-citation");
results = $("#results");

determineCitationType(testCases);

newTestButton.click(function(e) {
  e.preventDefault();
  var userInput = $("#input-citation"),
      currentCitation = userInput.val()

  userInput.val("");
  results.append($("<p></p>")
      .text(currentCitation)
      .addClass("result-citation  citation"))

  determineCitationType($(".result-citation"))
})

// var sources = {
//   westlaw: {
//     usConst: (function(){
//       var cite = noJumpCite.usConst;
//
//       return function() {
//         console.log("the westlaw citation url is " + cite);
//       }
//     })()
//   }
// }
