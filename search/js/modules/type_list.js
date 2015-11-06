module.exports = [
  {
    name:            "us_constitution",
    idPattern:       /U\.?S\.? Const/i,
    mainCitePattern: /(.+), cl\./
  },
  {
    name:            "cfr",
    idPattern:       /(?:C\.? ?F\.? ?R\.?)/i,
    mainCitePattern: /([^\(]+)(?:\s*\(.\))+/
  },
  {
    name:            "usc",
    idPattern:       /(?:u\.? ?s\.? ?c\.?)/i,
    mainCitePattern: /([^\(]+)(?:\s*\(.\))+/
  },
  {
    name:            "frap",
    idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:appellate|app|a)/i,
    mainCitePattern: /([^(]+)(?:s*(.))+/
  },
  {
    name:            "frcrmp",
    idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:criminal|crim|cr)/i,
    mainCitePattern: /([^(]+)(?:s*(.))+/
  },
  {
    name:            "frcp",
    idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:civil|civ|c)/i,
    mainCitePattern: /([^(]+)(?:s*(.))+/
  },
  {
    name:            "fre",
    idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:evidence|evid|e)/i,
    mainCitePattern: /([^(]+)(?:s*(.))+/
  },
  {
    name:            "frbp",
    idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:bankruptcy|bankr|bkrtcy)/i,
    mainCitePattern: /([^(]+)(?:s*(.))+/
  },
  {
    name:            "federal_case",
    idPattern:       /\d{1,5} (?:u\.? ?s\.?|s\. ?ct\.|f\.(?:supp\.?)?(?:\dd)?) d{1,5}/i,
    // some federal case citations have, e.g. '(2006)' following jump cite
    // (if present): anything to do about it?
    mainCitePattern: /(.+\d{1,5})(?:, ?\d{1,5})/
  },
  {
    name:            "state_constitution",
    idPattern:       /const/i,
    mainCitePattern: /(.*(?:section|\u00a7) ?[\d\.]+).+/i
  },
  {
    name:            "law_statute_code_rule",
    idPattern:       /(?:laws?)|(?:stat\.?)|(?:code)|(?:regs\.?)|(?:rule)/i,
    mainCitePattern: /([^\(]+)(?:\s*\(.\))+/
  },
  {
    name:            "default",
    idPattern:       /.*/,
    mainCitePattern: /(?:(.+\d+)(?:, ?\d+))|(?:([^\(]+)(?:\s*\(.\))+)/
  },
]

