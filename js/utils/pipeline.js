const after = require(`./after`)

module.exports = function pipeline(...fns) {
  return fns.reduce((acc, fn) => after(acc, fn))
}
