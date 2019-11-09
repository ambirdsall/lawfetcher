const urlEncode = window.encodeURIComponent
import { includes } from 'lodash-es'

// meant to be invoked as a method of with a manually-provided this object, e.g.
// `genericUrl.call(source, cite)`
export default function genericUrl(cite) {
  const properCitation = urlEncode(
    this.canDeepLink(cite.type)
    ? cite.fullCite
    : cite.mainCite
  )

  return this.baseUrl + properCitation
}
