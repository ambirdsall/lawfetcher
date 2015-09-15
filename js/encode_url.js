$(function() {
  var url = "http://birdsall.xyz/linkresolver/search/",
      submit      = $("#submit"),
      results     = $("#results"),
      copyButton = $("#copy-button");

  submit.click(function(e) {
    e.preventDefault();
    var citation = $.trim($("#url-encoder__input").val()),
    queryString = window.encodeURIComponent(citation),
    generatedUrl = url + "?q=" + queryString;

    // link for test purposes. May be deprecated for release.
    results.append($("<a></a>")
              .html(generatedUrl)
              .attr({href: generatedUrl})
              .addClass("text-center  col-xs-8  col-xs-offset-2  debugging-link"));
  });

  });
