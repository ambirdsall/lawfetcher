import { compose } from '../utils'

export const urlEncode = compose(window.encodeURIComponent, (encodedURIComponent) => {
  return encodedURIComponent.replace(/%20/g, '_')
})

export const urlDecode = compose(window.decodeURIComponent, (decodedURIComponent) => {
  return decodedURIComponent.replace(/_/g, ' ')
})
