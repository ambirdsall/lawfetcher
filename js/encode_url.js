var url = "https://birdsall.xyz/linkresolver/search",
    submit = document.getElementById("submit"),
    results = document.getElementById("results");

submit.onclick= function(e) {
  e.preventDefault();
  var citation = document.getElementById("url-encoder__input").value,
      queryString = window.encodeURIComponent(citation),
      generatedUrl = url + "?q=" + queryString;

  results.innerHTML = "<a class='text-center col-xs-8 col-xs-offset-2' href='" + generatedUrl + "'>" + generatedUrl + "</a>";
}
