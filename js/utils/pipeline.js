import { after } from '.'

export default function pipeline(...fns) {
  return fns.reduce((acc, fn) => after(acc, fn))
}
