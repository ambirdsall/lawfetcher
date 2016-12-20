const head                   = require(`lodash/head`)
const captureGroup           = require(`../utils/captureGroup`)
const curry                  = require(`../utils/curry`)
const matchAnyOf             = require(`../utils/matchAnyOf`)
const matchAllOf             = require(`../utils/matchAllOf`)
const anyStateAbbreviation   = matchAnyOf.apply(null, require(`./state_abbreviations`))
const anyFederalCaseReporter = matchAnyOf.apply(null, require(`./federal_case_reporters`))
const fedRuleNumberWithJump  = curry(federalRuleNumber)(true)
const fedRuleNumber          = curry(federalRuleNumber)(false)

module.exports = [
  { typeId:          `us_constitution`//{{{
  , idPattern:       /U\.?S\.? Const/i
  , mainCitePattern: /(.+), cl\./
  , _subparts:       { article: c => captureGroup(/art(?:\.?|icle) ?([0-9ivxlc]+)/i, c)
                     , section: c => captureGroup(/(?:sect(?:\.|ion)?|\u00a7) ?([0-9ivxlc]+)/i, c)
                     }
  }//}}}
, { typeId:          `cfr`//{{{
  , idPattern:       /(?:C\.? ?F\.? ?R\.?)/i
  , mainCitePattern: /([^\(]+)(?:\s*\([^)]{1,4}\))+/
  , _subparts: { title:   c => head(c.match(/\d+/))
               , section: c => captureGroup(/\d+\D+(?:sect(?:\.|ion)?|\u00a7)? ?([0-9\.]+)/i, c)
               , part:    c => captureGroup(/(\d+)\.\d+/, c)
               }
  }//}}}
, { typeId:          `usc`//{{{
  , idPattern:       /(?:u\.? ?s\.? ?c\.?)/i
  , mainCitePattern: /([^\(]+)(?:\s*\([^)]{1,4}\))+/
  , _subparts: { title:   c => head(c.match(/\d+/))
               , section: c => captureGroup(/\d+\D+(?:sect(?:\.|ion)?|\u00a7)? ?([\w\-\.]+)/i, c)
               }
  }//}}}
, { typeId:          `uniform_commercial_code`//{{{
  , idPattern:       /u\.? ?c\.? ?c\.? /i
  , mainCitePattern: /(.*)/
  , _subparts:       { article: c => captureGroup(/(\d)-\d+/, c)
                     , section: c => captureGroup(/\d-(\d+)/, c)
                     }
  }//}}}
, { typeId:          `wl_database`//{{{
  , idPattern:       /(?:\d+ WL \d+)/i
  , mainCitePattern: /(\d+ WL \d+)(?:, \d+)+/
  }//}}}
, { typeId:          `public_law`//{{{
  , idPattern:       /pub[. ]{0,2}l/i
  , mainCitePattern: /(.*)/
  , _subparts:       { congress: c => captureGroup(/(\d*)-\d*/, c)
                     , law:      c => captureGroup(/\d*-(\d*)/, c)
                     }
  }//}}}
, { typeId:          `statutes_at_large`//{{{
  , idPattern:       /\d+ stat\.? \d+/i
  , mainCitePattern: /(.*)/
  , _subparts:       { volume: c => head(c.match(/^\d+/))
                     , page:   c => captureGroup(/stat\.? (\d+)/i, c)
                     }
  }//}}}
, { typeId:          `federal_register`//{{{
  , idPattern:       /(?:(?:federal|fed\.) ?(register|reg\.)|(?:f\.r\.)|(?: fr ))/i
  , mainCitePattern: /(.+\d{1,5})(?:, [\d,]{1,6})/
  , _subparts:       { volume: c => head(c.match(/^\d+/))
                     , page:   c => head(c.match(/[\d,]+$/)).replace(`,`, ``)
                     }
  }//}}}
, { typeId:          `frap`//{{{
  , idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:appellate|app|a)/i
  , mainCitePattern: /([^(]+)(?:s*(.))+/
  , _subparts:       { ruleNumber:            fedRuleNumber
                     , ruleNumberAndJumpCite: fedRuleNumberWithJump
                     }
  }//}}}
, { typeId:          `frcrmp`//{{{
  , idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:criminal|crim|cr)/i
  , mainCitePattern: /([^(]+)(?:s*(.))+/
  , _subparts:       { ruleNumber:            fedRuleNumber
                     , ruleNumberAndJumpCite: fedRuleNumberWithJump
                     }
  }//}}}
, { typeId:          `frcp`//{{{
  , idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:civil|civ|c)/i
  , mainCitePattern: /([^(]+)(?:s*(.))+/
  , _subparts:       { ruleNumber:            fedRuleNumber
                     , ruleNumberAndJumpCite: fedRuleNumberWithJump
                     }
  }//}}}
, { typeId:          `fre`//{{{
  , idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:evidence|evid|e)/i
  , mainCitePattern: /([^(]+)(?:s*(.))+/
  , _subparts:       { ruleNumber:            fedRuleNumber
                     , ruleNumberAndJumpCite: fedRuleNumberWithJump
                     }
  }//}}}
, { typeId:          `frbp`//{{{
  , idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:bankruptcy|bankr|bkrtcy|b)/i
  , mainCitePattern: /([^(]+)(?:s*(.))+/
  , _subparts:       { ruleNumber:            fedRuleNumber
                     , ruleNumberAndJumpCite: fedRuleNumberWithJump
                     }
  }//}}}
, { typeId:          `scotus_us_reports`//{{{
  , idPattern:       /\d{1,5} (?:u\.? ?s\.?) \d{1,5}/i
  , // some supreme court case citations have, e.g. '(2006)'
    mainCitePattern: /(.+\d{1,5})(?:, [\d,]{1,6})/
  , _subparts:       { volume: c => captureGroup(/(\d+)/, c)
                     , page:   c => captureGroup(/\d+\s+(?:U\.? ?S\.?)\s+([0-9]+)/i, c)
                     }
  }//}}}
, { typeId:          `federal_case`//{{{
  , idPattern:       matchAllOf(/\d{1,5} /, anyFederalCaseReporter, / \d{1,5}/)
    // some federal case citations have, e.g. '(2006)' following jump cite
    // (if present): anything to do about it?
  , mainCitePattern: /(.+\d{1,5})(?:, [\d,]{1,6})/
  , _subparts: { volume:   c => head(c.match(/^\d+/))
               , reporter: c => head(c.match(anyFederalCaseReporter))
               , page:     c => captureGroup(matchAllOf(anyFederalCaseReporter, / (\d{1,5})/), c)
               }
  }//}}}
, { typeId:          `state_constitution`//{{{
  , idPattern:       matchAllOf(anyStateAbbreviation, / [Cc]onst/)
  , mainCitePattern: /(.*(?:section|\u00a7) ?[\d\.]+).+/i
  }//}}}
, { typeId:          `law_journal`//{{{
  , idPattern:       matchAnyOf( /L\. ?J\./
                                  , /L\. ?Rev\./
                                  , /J\.[\w&'.\s]+L\./
                                  , `J.L. & Econ.`
                                  , `J. Emp. Legal Stud.`
                                  , `J. Legal Stud.`
                                  , `L. & Contemp. Probs.`
                                  , `Sup. Ct. Rev.`
                                  )
  // TODO: do these citations ever have jump cites?
  , mainCitePattern: /(.*)/i
  }//}}}
, { typeId:          `law_statute_code_rule`//{{{
  , idPattern:       /(?:laws?)|(?:stat\.?)|(?:code)|(?:regs\.?)|(?:rule)/i
  , mainCitePattern: /([^\(]+)(?:\s*\([^)]{1,4}\))+/
  }//}}}
, { typeId:          `docket_number`//{{{
  , idPattern:       /^No\. \d+/i
  , mainCitePattern: /(.+)/
  , _subparts:       { rawNumber: c => c.slice(4) }
  }//}}}
, { typeId:          `default`//{{{
  , idPattern:       /.*/
  , mainCitePattern: /(?:(.+\d+)(?:, (?:\u00b6 ?)?\d+))|(?:([^\(]+)(?:\s*\([^)]{1,4}\))+)/
  }//}}}
]

function federalRuleNumber(withJumpCite, citeText) {
  const matcher = ( withJumpCite
                  ? /\d+\.?\d* ?(?:\([^)]{1,4}\) ?)*/
                  : /\d+(?:\.\d+)?/
                  )
  let ruleNumberMatch

  if ( ruleNumberMatch = citeText.match(matcher) ) return head(ruleNumberMatch)
}

// vim:foldmethod=marker:foldmarker={{{,}}}:foldlevel=0:foldopen=:foldclose=
