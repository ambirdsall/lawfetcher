let urlHelpers = {}
const after    = require(`../utils/after`)

urlHelpers.urlEncode = after(window.encodeURIComponent, (encodedURIComponent) => {
  return encodedURIComponent.replace(/%20/g, `_`)
})

urlHelpers.urlDecode = after(window.decodeURIComponent, (decodedURIComponent) => {
  return decodedURIComponent.replace(/_/g, ` `)
})

module.exports = urlHelpers
