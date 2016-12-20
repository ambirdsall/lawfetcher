module.exports = function escapeRegExp(string){
  if (typeof string !== `string`) throw `${string} not a string`
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
