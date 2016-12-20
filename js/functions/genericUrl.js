const urlEncode = window.encodeURIComponent
const includes  = require(`lodash/includes`)

// meant to be invoked as `genericUrl.call(source, cite)`
module.exports = function genericUrl(cite) {
  const properCitation = urlEncode(
    this.canDeepLink(cite.type)
    ? cite.fullCite
    : cite.mainCite
  )

  return this.baseUrl + properCitation
}
