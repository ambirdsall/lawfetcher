var urlEncode = window.encodeURIComponent

// meant to be invoked as `genericUrl.call(source, cite)`
module.exports = function genericUrl(cite) {
  var properCitation = (
    // if canDeepLink contains either the citation type or '*'
    this.canDeepLink.indexOf(cite.type) != -1
    || this.canDeepLink.indexOf('*') != -1
    // return deep or 'shallow' link
    ? cite.fullCite
    : cite.mainCite
  )

  return this.baseUrl + urlEncode(properCitation)
}
