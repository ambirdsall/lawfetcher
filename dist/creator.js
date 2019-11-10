(function () {
  'use strict';

  // if there's a double section followed by stuff, a comma, and then more stuff,
  // remove the comma and that which follows (i.e. for "§§ 123-125" => "§ 123";
  // similar w/ "§§ 123, 125"
  function cleanDoubleSections(citation) {
    if ( /\u00a7{2}/.test(citation) ) {
      // Given a string like /§§.+,.+/, it attempts to strip compound citation
      // down to single citation by only keeping the characters from (inclusive)
      // the second § to the character before the comma. Failing that, it replaces
      // any "§§" with "§".
      return citation.replace(/\u00a7(\u00a7 ?[^,]+),.+/, "$1")
                     .replace(/\u00a7{2}/, "§")
    } else {
      return citation
    }
  }

  // Define a new function from fn1 and fn2 equivalent to fn2(fn1)
  //
  // An optional thisArg is provided in case the new function is being defined on
  // an object and needs to be able to reference its properties with `this`:
  // without providing it, `this` will refer to the global object.
  function compose(fn1, fn2, thisArg) {
    thisArg = thisArg || this;

    return function() { return fn2.call(thisArg, fn1.apply(thisArg, arguments)) }
  }

  function curry(fn) {
    var arity = fn.length;

    return function f1() {
      var args = [], len = arguments.length;
      while ( len-- ) args[ len ] = arguments[ len ];

      if (args.length >= arity) {
        return fn.apply(null, args)
      } else {
        return function f2() {
          var args2 = [], len = arguments.length;
          while ( len-- ) args2[ len ] = arguments[ len ];

          return f1.apply(null, args.concat(args2))
        }
      }
    }
  }

  // Even though lodash's version of each is nicer (by passing the index as the
  // first argument to the iteratee function, jQuery rather undermines the whole
  // "don't require the coder to think about how you're iterating" thing), using
  // the jQuery version means the creator page bundle doesn't need to load any of
  // lodash, which makes a much smaller bundle for users to download
  var each = $.each;

  // Why pass in the constructor as an argument? Clearly, `detectType` relies on
  // the structure of the `Citation` function: note the arguments passed to the
  // `constructor` argument. Problem is, the `Citation` constructor assigns
  // `detectType` to its `from` method. This makes for a lovely API, but it also
  // means one of three problematic things must be true:
  //   1) '../types/citation' is imported to hardcode the obvious
  //      dependency on `Citation` in `detectType.js` AND
  //      '../functions/detectType' is imported in `citation.js`, which is
  //      a circular dependency that breaks stuff. (TODO: is this actually true?)
  //   2) `detectType` is defined in the same file as `Citation`, meaning it
  //      cannot be tested in its current level of isolation. It can't be
  //      imported into its own test file, and the `Citation.from` definition
  //      prefills the `taxonomy` argument, meaning it cannot be tested as such
  //      with any controls for the actual citation `type_list`.
  //   3) the constructor is extracted to an argument even though only one value
  //      makes any sense to be passed in.
  // Of the available problems, I like 3) the best.
  curry(function detectType(citationConstructor, taxonomy, citationText) {
    var len = taxonomy.length;
    var i;

    for ( i = 0; i < len; ++i ) {
      if ( citationText.match(taxonomy[i].idPattern) ) {
        return new citationConstructor(citationText, taxonomy[i])
      }
    }
  });

  var urlEncode = compose(window.encodeURIComponent, function (encodedURIComponent) {
    return encodedURIComponent.replace(/%20/g, '_')
  });

  var urlDecode = compose(window.decodeURIComponent, function (decodedURIComponent) {
    return decodedURIComponent.replace(/_/g, ' ')
  });

  function validateInput(input) {
    // Whitelisted characters, /as they appear in the regex/:
    //
    //   Spaces,           / \u00a0/ (note the literal space before the non-breaking space unicode)
    //   Letters,          /a-zA-Z/
    //   Numbers,          /\d/
    //   Dashes,           /-\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uff0d/
    //   Parentheses,      /\(\)/
    //   Comma,            /,/
    //   Period,           /\./
    //   Colon,            /:/
    //   Apostrophe,       /'\u2019/ (\u2019 is the unicode for the curly version)
    //   Forward slash,    /\//
    //   Section symbol,   /\u00a7/
    //   Paragraph symbol, /\u00b6/
    //   Ampersand,        /&/
    return /^[ \u00a0a-zA-Z\d-\u2010\u2011\u2012\u2013\u2014\u2015\u2212\uff0d\(\),\.:'\u2019\/\u00a7\u00b6&]*$/.test(input)
  }

  function handleAutoforwardPreference() {
    localStorage.getItem('autoforward', function (err, value) {
      if (err) {
        console.log(err);
      } else {
        // if there's a value, create a "remove autoforwarding" button, append it
        // to the DOM, and add an event handler which calls localStorage.removeItem()
        // the removeItem success callback should ice the button with a nice
        // jQuery fade out
        if (value) {
          $('.center-column')
            .append($('<button></button>')
                    .addClass('btn btn-danger center-block')
                    .attr('id', 'autoforward-remover')
                    .html('Remove Autoforwarding')
                    .click(function (e) {
                      localStorage.removeItem('autoforward', function (err) {
                        if (err) {
                          console.log(err);
                        } else {
                          $('#autoforward-remover').removeClass('btn-danger').addClass('btn-success').fadeOut();
                        }
                      });
                    }));
        }
      }
    });
  }

  var resultsBaseUrl = (window.location.href) + "citation";
  var $input         = $('#url-encoder__input');
  var $helpText      = $('#submit--input-validator-text');

  function buildUrl(citation) {
    return (resultsBaseUrl + "#" + (urlEncode(citation)))
  }
  function processForm(e) {
    e.preventDefault();
    var citation = cleanDoubleSections($.trim($input.val()));

    if (!citation.length) { return }

    if ( validateInput(citation) ) {
      window.location.href = buildUrl(citation);
    } else {
      $input.parent().addClass('has-error');
      $helpText.show();
    }
  }

  // attach `processForm` to either way the button's liable to be triggered
  $('#url-encoder__form').submit(processForm);
  $('#submit').click(processForm);

  handleAutoforwardPreference();

}());
