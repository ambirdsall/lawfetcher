function buildLink(aTag, linkAddress) {
  var p = $("<p></p>");
  aTag.attr("href", linkAddress);
  p.html(linkAddress);
  aTag.append(p);
}

// window.location.search returns the query string verbatim, including the
// delimiting '?'. Indeces 0-2 of the query string ('?q=') are boilerplate
// and provide no useful information, so only indeces 3+ are saved
var query = window.location.search.slice(3),
    title = $("#title"),
    // For each source, provide an object with three properties:
    //    url: the entire path up to params for that source's citation search
    //    archorTag: a DOM element. They will all have identically formatted IDs.
    //    canDeepLink: evaluated as boolean
    sources = [
      {
        name: "Westlaw",
        url: "http://a.next.westlaw.com/Link/Document/FullText?findType=Y&cite=",
        anchorTag: $("#link--westlaw__a"),
        canDeepLink: false
      },
      {
        name: "Lexis",
        url: "http://advance.lexis.com/laapi/search?q=",
        anchorTag: $("#link--lexis__a"),
        canDeepLink: true
      },
      {
        name: "Ravel",
        url: "http://www.ravellaw.com/search?query=",
        anchorTag: $("#link--ravel__a"),
        canDeepLink: false
      },
      {
        name: "Google Scholar",
        url: "https://scholar.google.com/scholar?as_sdt=2006&hl=en&q=",
        anchorTag: $("#link--google-scholar__a"),
        canDeepLink: false
      },
      {
        name: "Google Search",
        url: "http://google.com/search?q=",
        anchorTag: $("#link--google__a"),
        canDeepLink: true
      }
    ];

    $.each(sources, function(index, info) {
      var currentSource = new Source(info.url),
          currentLink   = currentSource.generateUrl(query);

      buildLink(info.anchorTag, currentLink);
    });

title.html(window.decodeURIComponent(query));

