var detectType = require('../search/js/functions/detectType'),
    Citation   = require('../search/js/types/citation'),
    mockTypes  = [
      {
        name: 'type_one',
        idPattern: /citation/i,
        mainCitePattern: /(.+) ?with/
      },
      {
        name: 'type_two',
        idPattern: /c(?:itation)? ?(?:t(?:wo)?|2)/i,
        mainCitePattern: /(.+), \d+/
      }
    ],
    mockCitationText = 'arbitrary citation text',
    mockJumpCiteText = 'arbitrary citation text with jump cite';

describe('The detectType function', function() {
  it('returns a Citation object', function() {
    var detectTypeReturn = detectType(mockTypes, mockCitationText);

    expect(detectTypeReturn).toEqual(jasmine.any(Citation));
  });

  it('assigns the first type whose idPattern matches the given text', function() {
    var returnType = detectType(mockTypes, mockCitationText).type;

    expect(returnType).toBe('type_one');
  });

  // The 'default' type is defined in the list of type config objects, not the fn
  xit('assigns the default type if there is no match', function() {
    var returnType = detectType(mockTypes, 'foo bar baz qux').type;

    expect(returnType).toBe('default');
  });

  it("separates out the matching type's jump cite, if present", function() {
    var jumpCiteReturn   = detectType(mockTypes, mockJumpCiteText),
        noJumpCiteReturn = detectType(mockTypes, mockCitationText);

    expect(jumpCiteReturn.jumpCite).toBe('with jump cite');
    expect(noJumpCiteReturn.jumpCite).toBe('');
  });
});
