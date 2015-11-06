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
    idpattern:       /(?:u\.? ?s\.? ?c\.?)/i,
    maincitepattern: /([^\(]+)(?:\s*\(.\))+/
  },
  {
    name:            "frap",
    idpattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:appellate|app|a)/i,
    maincitepattern: /([^(]+)(?:s*(.))+/
  },
  {
    name:            "frcrmp",
    idpattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:criminal|crim|cr)/i,
    maincitepattern: /([^(]+)(?:s*(.))+/
  },
  {
    name:            "frcp",
    idpattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:civil|civ|c)/i,
    maincitepattern: /([^(]+)(?:s*(.))+/
  },
  {
    name:            "fre",
    idpattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:evidence|evid|e)/i,
    maincitepattern: /([^(]+)(?:s*(.))+/
  },
  {
    name:            "frbp",
    idpattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:bankruptcy|bankr|bkrtcy)/i,
    maincitepattern: /([^(]+)(?:s*(.))+/
  },
  {
    name:            "federal_case",
    idpattern:       /\d{1,5} (?:u\.? ?s\.?|s\. ?ct\.|f\.(?:supp\.?)?(?:\dd)?) d{1,5}/i,
    // some federal case citations have, e.g. '(2006)' following jump cite
    // (if present): anything to do about it?
    maincitepattern: /(.+\d{1,5})(?:, ?\d{1,5})/
  },
  {
    name:            "state_constitution",
    idpattern:       /const/i,
    maincitepattern: /(.*(?:section|\u00a7) ?[\d\.]+).+/i
  },
  {
    name:            "law_statute_code_rule",
    idpattern:       /(?:laws?)|(?:stat\.?)|(?:code)|(?:regs\.?)|(?:rule)/i,
    maincitepattern: /([^\(]+)(?:\s*\(.\))+/
  },
  {
    name:            "default",
    idPattern:       /.*/,
    mainCitePattern: /(?:(.+\d+)(?:, ?\d+))|(?:([^\(]+)(?:\s*\(.\))+)/
  },
]

