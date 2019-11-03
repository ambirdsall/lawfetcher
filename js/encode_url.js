import { validateInput } from './functions'
import { urlEncode } from './functions'
import { cleanDoubleSections } from './functions'
const resultsBaseUrl = `${window.location.href}citation?`
const $input         = $('#url-encoder__input')
const $helpText      = $('#submit--input-validator-text')

function buildUrl(citation) {
  return `${resultsBaseUrl}${urlEncode(citation)}`
}
function processForm(e) {
  e.preventDefault()
  const citation = cleanDoubleSections($.trim($input.val()))

  if (!citation.length) return

  if ( validateInput(citation) ) {
    window.location.href = buildUrl(citation)
  } else {
    $input.parent().addClass('has-error')
    $helpText.show()
  }
}

// attach `processForm` to either way the button's liable to be triggered
$('#url-encoder__form').submit(processForm)
$('#submit').click(processForm)
