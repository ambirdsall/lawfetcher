import { after } from '../utils'

export const urlEncode = after(window.encodeURIComponent, (encodedURIComponent) => {
  return encodedURIComponent.replace(/%20/g, '_')
})

export const urlDecode = after(window.decodeURIComponent, (decodedURIComponent) => {
  return decodedURIComponent.replace(/_/g, ' ')
})
