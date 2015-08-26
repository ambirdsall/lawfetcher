Source = function(baseUrl) {
  this.baseUrl = baseUrl;
}

Source.prototype.generateUrl = function(queryString) {
  return this.baseUrl + queryString;
}
