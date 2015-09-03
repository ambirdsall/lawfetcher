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

function determineCitationType($set) {
  $set.filterOutAndClassify(/U\.?S\.? Const/i, "test-1")
      .filterOutAndClassify(/Const/i, "test-2")
      .filterOutAndClassify(/(?:C\.? ?F\.? ?R\.?)|(?:U\.? ?S\.? ?C\.?)/i, "test-3")
      .filterOutAndClassify(/(?:laws?)|(?:stat\.?)|(?:code)|(?:regs\.?)|(?:rule)/i, "test-4")
      // .addClass("test-5")
}

var testCases = $(".test-case"),
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
      .addClass("result-citation"))

  determineCitationType($(".result-citation"))
})



  // testCases.filter(function(i) {
  //   return $(this).text().match(/U\.?S\.? Const/i);
  // }).addClass("test-1");

  // testCases.filter(function(i) {
  //   return $(this).text().search(/U\.?S\.?/i) === -1
  // })
  //   .filter(function(i) {
  //     return $(this).text().match(/const\.?/i);
  //   }).addClass("test-2");

  // $(citations).each(function(i,c){
  //   console.log(i+1 + ": " + c);

  //   var matchData = c.match(/\d+ ([\w. ]+) \d+(?:, (\d+(?:-(\d+))?))?/);

  //   console.log(matchData);
  // })
// })
