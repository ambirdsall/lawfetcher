$(function() {
  var url = "http://birdsall.xyz/search/",
      submit      = $("#submit"),
      results     = $("#results"),
      copyButton = $("#copy-button");

  submit.click(function(e) {
    e.preventDefault();
    var citation = $("#url-encoder__input").val(),
    queryString = window.encodeURIComponent(citation),
    generatedUrl = url + "?q=" + queryString;

    // results.append($("<div></div>")
    //           .addClass("input-group col-xs-8 col-xs-offset-2")
    //           .append($("<input></input>")
    //               .attr({type: "text"})
    //               .prop("readonly", true)
    //               .addClass("form-control")
    //               .val(generatedUrl))
    //           .append($("<span></span>")
    //               .addClass("input-group-btn")
    //               .append($("<button></button>")
    //                 .addClass("btn btn-default")
    //                 .attr({
    //                   type: "button",
    //                   id: "copy-button"
    //                 })
    //                 .html("Copy")
    //                 .click(function(e) {
    //                   // TODO actually copy
    //                   console.log("hey cool");
    //                 }))));

    // link for test purposes. May be deprecated for release.
    results.append($("<a></a>")
              .html(generatedUrl)
              .attr({href: generatedUrl})
              .addClass("text-center  col-xs-8  col-xs-offset-2  debugging-link"));
  });

  });
