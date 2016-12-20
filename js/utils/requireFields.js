// Even though lodash's version of each is nicer (by passing the index as the
// first argument to the iteratee function, jQuery rather undermines the whole
// "don't require the coder to think about how you're iterating" thing), using
// the jQuery version means the creator page bundle doesn't need to load any of
// lodash, which makes a much smaller bundle for users to download
const each = $.each

module.exports = function requiredFields(obj, ...fields) {
  each(fields, (_idx, f) => {
    if ( !(f in obj) ) { throw `Required field ${f} not in ${Object.keys(obj)}` }
  })
  return true
}
