import compose from './compose'

export default function pipeline(...fns) {
  return fns.reduce((acc, fn) => compose(acc, fn))
}
