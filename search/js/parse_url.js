function buildLink(aTag, linkAddress) {
  var p = document.createElement("p");
  aTag.href = linkAddress;
  p.innerHTML = linkAddress;
  aTag.appendChild(p);
}

// window.location.search returns the query string verbatim, including the
// delimiting '?'. Indeces 0-2 of the query string ('?q=') are boilerplate
// and provide no useful information, so only indeces 3+ are saved
var query = window.location.search.slice(3),
    title = document.getElementById("title"),
    westlaw = new Source("http://a.next.westlaw.com/Link/Document/FullText?findType=Y&cite="),
    westlawLink = westlaw.generateUrl(query),
    westlawAnchorTag = document.getElementById("link--westlaw__a"),
    lexis = new Source("http://advance.lexis.com/laapi/search?q="),
    lexisLink = lexis.generateUrl(query),
    lexisAnchorTag = document.getElementById("link--lexis__a");

title.innerHTML = window.decodeURIComponent(query);

buildLink(westlawAnchorTag, westlawLink);
buildLink(lexisAnchorTag, lexisLink);
