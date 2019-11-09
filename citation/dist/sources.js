(function () {
  'use strict';

  /** Detect free variable `global` from Node.js. */
  var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

  /** Detect free variable `self`. */
  var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

  /** Used as a reference to the global object. */
  var root = freeGlobal || freeSelf || Function('return this')();

  /** Built-in value references. */
  var Symbol$1 = root.Symbol;

  /** Used for built-in method references. */
  var objectProto = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty = objectProto.hasOwnProperty;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString = objectProto.toString;

  /** Built-in value references. */
  var symToStringTag = Symbol$1 ? Symbol$1.toStringTag : undefined;

  /**
   * A specialized version of `baseGetTag` which ignores `Symbol.toStringTag` values.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the raw `toStringTag`.
   */
  function getRawTag(value) {
    var isOwn = hasOwnProperty.call(value, symToStringTag),
        tag = value[symToStringTag];

    try {
      value[symToStringTag] = undefined;
      var unmasked = true;
    } catch (e) {}

    var result = nativeObjectToString.call(value);
    if (unmasked) {
      if (isOwn) {
        value[symToStringTag] = tag;
      } else {
        delete value[symToStringTag];
      }
    }
    return result;
  }

  /** Used for built-in method references. */
  var objectProto$1 = Object.prototype;

  /**
   * Used to resolve the
   * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
   * of values.
   */
  var nativeObjectToString$1 = objectProto$1.toString;

  /**
   * Converts `value` to a string using `Object.prototype.toString`.
   *
   * @private
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   */
  function objectToString(value) {
    return nativeObjectToString$1.call(value);
  }

  /** `Object#toString` result references. */
  var nullTag = '[object Null]',
      undefinedTag = '[object Undefined]';

  /** Built-in value references. */
  var symToStringTag$1 = Symbol$1 ? Symbol$1.toStringTag : undefined;

  /**
   * The base implementation of `getTag` without fallbacks for buggy environments.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  function baseGetTag(value) {
    if (value == null) {
      return value === undefined ? undefinedTag : nullTag;
    }
    return (symToStringTag$1 && symToStringTag$1 in Object(value))
      ? getRawTag(value)
      : objectToString(value);
  }

  /**
   * Checks if `value` is object-like. A value is object-like if it's not `null`
   * and has a `typeof` result of "object".
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
   * @example
   *
   * _.isObjectLike({});
   * // => true
   *
   * _.isObjectLike([1, 2, 3]);
   * // => true
   *
   * _.isObjectLike(_.noop);
   * // => false
   *
   * _.isObjectLike(null);
   * // => false
   */
  function isObjectLike(value) {
    return value != null && typeof value == 'object';
  }

  /** `Object#toString` result references. */
  var symbolTag = '[object Symbol]';

  /**
   * Checks if `value` is classified as a `Symbol` primitive or object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
   * @example
   *
   * _.isSymbol(Symbol.iterator);
   * // => true
   *
   * _.isSymbol('abc');
   * // => false
   */
  function isSymbol(value) {
    return typeof value == 'symbol' ||
      (isObjectLike(value) && baseGetTag(value) == symbolTag);
  }

  /**
   * A specialized version of `_.map` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the new mapped array.
   */
  function arrayMap(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length,
        result = Array(length);

    while (++index < length) {
      result[index] = iteratee(array[index], index, array);
    }
    return result;
  }

  /**
   * Checks if `value` is classified as an `Array` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array, else `false`.
   * @example
   *
   * _.isArray([1, 2, 3]);
   * // => true
   *
   * _.isArray(document.body.children);
   * // => false
   *
   * _.isArray('abc');
   * // => false
   *
   * _.isArray(_.noop);
   * // => false
   */
  var isArray = Array.isArray;

  /** Used as references for various `Number` constants. */
  var INFINITY = 1 / 0;

  /** Used to convert symbols to primitives and strings. */
  var symbolProto = Symbol$1 ? Symbol$1.prototype : undefined,
      symbolToString = symbolProto ? symbolProto.toString : undefined;

  /**
   * The base implementation of `_.toString` which doesn't convert nullish
   * values to empty strings.
   *
   * @private
   * @param {*} value The value to process.
   * @returns {string} Returns the string.
   */
  function baseToString(value) {
    // Exit early for strings to avoid a performance hit in some environments.
    if (typeof value == 'string') {
      return value;
    }
    if (isArray(value)) {
      // Recursively convert values (susceptible to call stack limits).
      return arrayMap(value, baseToString) + '';
    }
    if (isSymbol(value)) {
      return symbolToString ? symbolToString.call(value) : '';
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
  }

  /**
   * Checks if `value` is the
   * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
   * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an object, else `false`.
   * @example
   *
   * _.isObject({});
   * // => true
   *
   * _.isObject([1, 2, 3]);
   * // => true
   *
   * _.isObject(_.noop);
   * // => true
   *
   * _.isObject(null);
   * // => false
   */
  function isObject(value) {
    var type = typeof value;
    return value != null && (type == 'object' || type == 'function');
  }

  /** Used as references for various `Number` constants. */
  var NAN = 0 / 0;

  /** Used to match leading and trailing whitespace. */
  var reTrim = /^\s+|\s+$/g;

  /** Used to detect bad signed hexadecimal string values. */
  var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

  /** Used to detect binary string values. */
  var reIsBinary = /^0b[01]+$/i;

  /** Used to detect octal string values. */
  var reIsOctal = /^0o[0-7]+$/i;

  /** Built-in method references without a dependency on `root`. */
  var freeParseInt = parseInt;

  /**
   * Converts `value` to a number.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to process.
   * @returns {number} Returns the number.
   * @example
   *
   * _.toNumber(3.2);
   * // => 3.2
   *
   * _.toNumber(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toNumber(Infinity);
   * // => Infinity
   *
   * _.toNumber('3.2');
   * // => 3.2
   */
  function toNumber(value) {
    if (typeof value == 'number') {
      return value;
    }
    if (isSymbol(value)) {
      return NAN;
    }
    if (isObject(value)) {
      var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
      value = isObject(other) ? (other + '') : other;
    }
    if (typeof value != 'string') {
      return value === 0 ? value : +value;
    }
    value = value.replace(reTrim, '');
    var isBinary = reIsBinary.test(value);
    return (isBinary || reIsOctal.test(value))
      ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
      : (reIsBadHex.test(value) ? NAN : +value);
  }

  /** Used as references for various `Number` constants. */
  var INFINITY$1 = 1 / 0,
      MAX_INTEGER = 1.7976931348623157e+308;

  /**
   * Converts `value` to a finite number.
   *
   * @static
   * @memberOf _
   * @since 4.12.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted number.
   * @example
   *
   * _.toFinite(3.2);
   * // => 3.2
   *
   * _.toFinite(Number.MIN_VALUE);
   * // => 5e-324
   *
   * _.toFinite(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toFinite('3.2');
   * // => 3.2
   */
  function toFinite(value) {
    if (!value) {
      return value === 0 ? value : 0;
    }
    value = toNumber(value);
    if (value === INFINITY$1 || value === -INFINITY$1) {
      var sign = (value < 0 ? -1 : 1);
      return sign * MAX_INTEGER;
    }
    return value === value ? value : 0;
  }

  /**
   * Converts `value` to an integer.
   *
   * **Note:** This method is loosely based on
   * [`ToInteger`](http://www.ecma-international.org/ecma-262/7.0/#sec-tointeger).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {number} Returns the converted integer.
   * @example
   *
   * _.toInteger(3.2);
   * // => 3
   *
   * _.toInteger(Number.MIN_VALUE);
   * // => 0
   *
   * _.toInteger(Infinity);
   * // => 1.7976931348623157e+308
   *
   * _.toInteger('3.2');
   * // => 3
   */
  function toInteger(value) {
    var result = toFinite(value),
        remainder = result % 1;

    return result === result ? (remainder ? result - remainder : result) : 0;
  }

  /**
   * This method returns the first argument it receives.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Util
   * @param {*} value Any value.
   * @returns {*} Returns `value`.
   * @example
   *
   * var object = { 'a': 1 };
   *
   * console.log(_.identity(object) === object);
   * // => true
   */
  function identity(value) {
    return value;
  }

  /** `Object#toString` result references. */
  var asyncTag = '[object AsyncFunction]',
      funcTag = '[object Function]',
      genTag = '[object GeneratorFunction]',
      proxyTag = '[object Proxy]';

  /**
   * Checks if `value` is classified as a `Function` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a function, else `false`.
   * @example
   *
   * _.isFunction(_);
   * // => true
   *
   * _.isFunction(/abc/);
   * // => false
   */
  function isFunction(value) {
    if (!isObject(value)) {
      return false;
    }
    // The use of `Object#toString` avoids issues with the `typeof` operator
    // in Safari 9 which returns 'object' for typed arrays and other constructors.
    var tag = baseGetTag(value);
    return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
  }

  /** Used to detect overreaching core-js shims. */
  var coreJsData = root['__core-js_shared__'];

  /** Used to detect methods masquerading as native. */
  var maskSrcKey = (function() {
    var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || '');
    return uid ? ('Symbol(src)_1.' + uid) : '';
  }());

  /**
   * Checks if `func` has its source masked.
   *
   * @private
   * @param {Function} func The function to check.
   * @returns {boolean} Returns `true` if `func` is masked, else `false`.
   */
  function isMasked(func) {
    return !!maskSrcKey && (maskSrcKey in func);
  }

  /** Used for built-in method references. */
  var funcProto = Function.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString = funcProto.toString;

  /**
   * Converts `func` to its source code.
   *
   * @private
   * @param {Function} func The function to convert.
   * @returns {string} Returns the source code.
   */
  function toSource(func) {
    if (func != null) {
      try {
        return funcToString.call(func);
      } catch (e) {}
      try {
        return (func + '');
      } catch (e) {}
    }
    return '';
  }

  /**
   * Used to match `RegExp`
   * [syntax characters](http://ecma-international.org/ecma-262/7.0/#sec-patterns).
   */
  var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;

  /** Used to detect host constructors (Safari). */
  var reIsHostCtor = /^\[object .+?Constructor\]$/;

  /** Used for built-in method references. */
  var funcProto$1 = Function.prototype,
      objectProto$2 = Object.prototype;

  /** Used to resolve the decompiled source of functions. */
  var funcToString$1 = funcProto$1.toString;

  /** Used to check objects for own properties. */
  var hasOwnProperty$1 = objectProto$2.hasOwnProperty;

  /** Used to detect if a method is native. */
  var reIsNative = RegExp('^' +
    funcToString$1.call(hasOwnProperty$1).replace(reRegExpChar, '\\$&')
    .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
  );

  /**
   * The base implementation of `_.isNative` without bad shim checks.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a native function,
   *  else `false`.
   */
  function baseIsNative(value) {
    if (!isObject(value) || isMasked(value)) {
      return false;
    }
    var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
    return pattern.test(toSource(value));
  }

  /**
   * Gets the value at `key` of `object`.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {string} key The key of the property to get.
   * @returns {*} Returns the property value.
   */
  function getValue(object, key) {
    return object == null ? undefined : object[key];
  }

  /**
   * Gets the native function at `key` of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {string} key The key of the method to get.
   * @returns {*} Returns the function if it's native, else `undefined`.
   */
  function getNative(object, key) {
    var value = getValue(object, key);
    return baseIsNative(value) ? value : undefined;
  }

  /* Built-in method references that are verified to be native. */
  var WeakMap = getNative(root, 'WeakMap');

  /**
   * A faster alternative to `Function#apply`, this function invokes `func`
   * with the `this` binding of `thisArg` and the arguments of `args`.
   *
   * @private
   * @param {Function} func The function to invoke.
   * @param {*} thisArg The `this` binding of `func`.
   * @param {Array} args The arguments to invoke `func` with.
   * @returns {*} Returns the result of `func`.
   */
  function apply(func, thisArg, args) {
    switch (args.length) {
      case 0: return func.call(thisArg);
      case 1: return func.call(thisArg, args[0]);
      case 2: return func.call(thisArg, args[0], args[1]);
      case 3: return func.call(thisArg, args[0], args[1], args[2]);
    }
    return func.apply(thisArg, args);
  }

  /** Used to detect hot functions by number of calls within a span of milliseconds. */
  var HOT_COUNT = 800,
      HOT_SPAN = 16;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeNow = Date.now;

  /**
   * Creates a function that'll short out and invoke `identity` instead
   * of `func` when it's called `HOT_COUNT` or more times in `HOT_SPAN`
   * milliseconds.
   *
   * @private
   * @param {Function} func The function to restrict.
   * @returns {Function} Returns the new shortable function.
   */
  function shortOut(func) {
    var count = 0,
        lastCalled = 0;

    return function() {
      var stamp = nativeNow(),
          remaining = HOT_SPAN - (stamp - lastCalled);

      lastCalled = stamp;
      if (remaining > 0) {
        if (++count >= HOT_COUNT) {
          return arguments[0];
        }
      } else {
        count = 0;
      }
      return func.apply(undefined, arguments);
    };
  }

  /**
   * Creates a function that returns `value`.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {*} value The value to return from the new function.
   * @returns {Function} Returns the new constant function.
   * @example
   *
   * var objects = _.times(2, _.constant({ 'a': 1 }));
   *
   * console.log(objects);
   * // => [{ 'a': 1 }, { 'a': 1 }]
   *
   * console.log(objects[0] === objects[1]);
   * // => true
   */
  function constant(value) {
    return function() {
      return value;
    };
  }

  var defineProperty = (function() {
    try {
      var func = getNative(Object, 'defineProperty');
      func({}, '', {});
      return func;
    } catch (e) {}
  }());

  /**
   * The base implementation of `setToString` without support for hot loop shorting.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var baseSetToString = !defineProperty ? identity : function(func, string) {
    return defineProperty(func, 'toString', {
      'configurable': true,
      'enumerable': false,
      'value': constant(string),
      'writable': true
    });
  };

  /**
   * Sets the `toString` method of `func` to return `string`.
   *
   * @private
   * @param {Function} func The function to modify.
   * @param {Function} string The `toString` result.
   * @returns {Function} Returns `func`.
   */
  var setToString = shortOut(baseSetToString);

  /**
   * A specialized version of `_.forEach` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns `array`.
   */
  function arrayEach(array, iteratee) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (iteratee(array[index], index, array) === false) {
        break;
      }
    }
    return array;
  }

  /**
   * The base implementation of `_.findIndex` and `_.findLastIndex` without
   * support for iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Function} predicate The function invoked per iteration.
   * @param {number} fromIndex The index to search from.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseFindIndex(array, predicate, fromIndex, fromRight) {
    var length = array.length,
        index = fromIndex + (fromRight ? 1 : -1);

    while ((fromRight ? index-- : ++index < length)) {
      if (predicate(array[index], index, array)) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.isNaN` without support for number objects.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is `NaN`, else `false`.
   */
  function baseIsNaN(value) {
    return value !== value;
  }

  /**
   * A specialized version of `_.indexOf` which performs strict equality
   * comparisons of values, i.e. `===`.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function strictIndexOf(array, value, fromIndex) {
    var index = fromIndex - 1,
        length = array.length;

    while (++index < length) {
      if (array[index] === value) {
        return index;
      }
    }
    return -1;
  }

  /**
   * The base implementation of `_.indexOf` without `fromIndex` bounds checks.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} value The value to search for.
   * @param {number} fromIndex The index to search from.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function baseIndexOf(array, value, fromIndex) {
    return value === value
      ? strictIndexOf(array, value, fromIndex)
      : baseFindIndex(array, baseIsNaN, fromIndex);
  }

  /**
   * A specialized version of `_.includes` for arrays without support for
   * specifying an index to search from.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludes(array, value) {
    var length = array == null ? 0 : array.length;
    return !!length && baseIndexOf(array, value, 0) > -1;
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER = 9007199254740991;

  /** Used to detect unsigned integer values. */
  var reIsUint = /^(?:0|[1-9]\d*)$/;

  /**
   * Checks if `value` is a valid array-like index.
   *
   * @private
   * @param {*} value The value to check.
   * @param {number} [length=MAX_SAFE_INTEGER] The upper bounds of a valid index.
   * @returns {boolean} Returns `true` if `value` is a valid index, else `false`.
   */
  function isIndex(value, length) {
    var type = typeof value;
    length = length == null ? MAX_SAFE_INTEGER : length;

    return !!length &&
      (type == 'number' ||
        (type != 'symbol' && reIsUint.test(value))) &&
          (value > -1 && value % 1 == 0 && value < length);
  }

  /**
   * Performs a
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * comparison between two values to determine if they are equivalent.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   * @example
   *
   * var object = { 'a': 1 };
   * var other = { 'a': 1 };
   *
   * _.eq(object, object);
   * // => true
   *
   * _.eq(object, other);
   * // => false
   *
   * _.eq('a', 'a');
   * // => true
   *
   * _.eq('a', Object('a'));
   * // => false
   *
   * _.eq(NaN, NaN);
   * // => true
   */
  function eq(value, other) {
    return value === other || (value !== value && other !== other);
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax = Math.max;

  /**
   * A specialized version of `baseRest` which transforms the rest array.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @param {Function} transform The rest array transform.
   * @returns {Function} Returns the new function.
   */
  function overRest(func, start, transform) {
    start = nativeMax(start === undefined ? (func.length - 1) : start, 0);
    return function() {
      var args = arguments,
          index = -1,
          length = nativeMax(args.length - start, 0),
          array = Array(length);

      while (++index < length) {
        array[index] = args[start + index];
      }
      index = -1;
      var otherArgs = Array(start + 1);
      while (++index < start) {
        otherArgs[index] = args[index];
      }
      otherArgs[start] = transform(array);
      return apply(func, this, otherArgs);
    };
  }

  /**
   * The base implementation of `_.rest` which doesn't validate or coerce arguments.
   *
   * @private
   * @param {Function} func The function to apply a rest parameter to.
   * @param {number} [start=func.length-1] The start position of the rest parameter.
   * @returns {Function} Returns the new function.
   */
  function baseRest(func, start) {
    return setToString(overRest(func, start, identity), func + '');
  }

  /** Used as references for various `Number` constants. */
  var MAX_SAFE_INTEGER$1 = 9007199254740991;

  /**
   * Checks if `value` is a valid array-like length.
   *
   * **Note:** This method is loosely based on
   * [`ToLength`](http://ecma-international.org/ecma-262/7.0/#sec-tolength).
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a valid length, else `false`.
   * @example
   *
   * _.isLength(3);
   * // => true
   *
   * _.isLength(Number.MIN_VALUE);
   * // => false
   *
   * _.isLength(Infinity);
   * // => false
   *
   * _.isLength('3');
   * // => false
   */
  function isLength(value) {
    return typeof value == 'number' &&
      value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER$1;
  }

  /**
   * Checks if `value` is array-like. A value is considered array-like if it's
   * not a function and has a `value.length` that's an integer greater than or
   * equal to `0` and less than or equal to `Number.MAX_SAFE_INTEGER`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is array-like, else `false`.
   * @example
   *
   * _.isArrayLike([1, 2, 3]);
   * // => true
   *
   * _.isArrayLike(document.body.children);
   * // => true
   *
   * _.isArrayLike('abc');
   * // => true
   *
   * _.isArrayLike(_.noop);
   * // => false
   */
  function isArrayLike(value) {
    return value != null && isLength(value.length) && !isFunction(value);
  }

  /** Used for built-in method references. */
  var objectProto$3 = Object.prototype;

  /**
   * Checks if `value` is likely a prototype object.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a prototype, else `false`.
   */
  function isPrototype(value) {
    var Ctor = value && value.constructor,
        proto = (typeof Ctor == 'function' && Ctor.prototype) || objectProto$3;

    return value === proto;
  }

  /**
   * The base implementation of `_.times` without support for iteratee shorthands
   * or max array length checks.
   *
   * @private
   * @param {number} n The number of times to invoke `iteratee`.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array} Returns the array of results.
   */
  function baseTimes(n, iteratee) {
    var index = -1,
        result = Array(n);

    while (++index < n) {
      result[index] = iteratee(index);
    }
    return result;
  }

  /** `Object#toString` result references. */
  var argsTag = '[object Arguments]';

  /**
   * The base implementation of `_.isArguments`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   */
  function baseIsArguments(value) {
    return isObjectLike(value) && baseGetTag(value) == argsTag;
  }

  /** Used for built-in method references. */
  var objectProto$4 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$2 = objectProto$4.hasOwnProperty;

  /** Built-in value references. */
  var propertyIsEnumerable = objectProto$4.propertyIsEnumerable;

  /**
   * Checks if `value` is likely an `arguments` object.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an `arguments` object,
   *  else `false`.
   * @example
   *
   * _.isArguments(function() { return arguments; }());
   * // => true
   *
   * _.isArguments([1, 2, 3]);
   * // => false
   */
  var isArguments = baseIsArguments(function() { return arguments; }()) ? baseIsArguments : function(value) {
    return isObjectLike(value) && hasOwnProperty$2.call(value, 'callee') &&
      !propertyIsEnumerable.call(value, 'callee');
  };

  /**
   * This method returns `false`.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {boolean} Returns `false`.
   * @example
   *
   * _.times(2, _.stubFalse);
   * // => [false, false]
   */
  function stubFalse() {
    return false;
  }

  /** Detect free variable `exports`. */
  var freeExports = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule = freeExports && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports = freeModule && freeModule.exports === freeExports;

  /** Built-in value references. */
  var Buffer = moduleExports ? root.Buffer : undefined;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeIsBuffer = Buffer ? Buffer.isBuffer : undefined;

  /**
   * Checks if `value` is a buffer.
   *
   * @static
   * @memberOf _
   * @since 4.3.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a buffer, else `false`.
   * @example
   *
   * _.isBuffer(new Buffer(2));
   * // => true
   *
   * _.isBuffer(new Uint8Array(2));
   * // => false
   */
  var isBuffer = nativeIsBuffer || stubFalse;

  /** `Object#toString` result references. */
  var argsTag$1 = '[object Arguments]',
      arrayTag = '[object Array]',
      boolTag = '[object Boolean]',
      dateTag = '[object Date]',
      errorTag = '[object Error]',
      funcTag$1 = '[object Function]',
      mapTag = '[object Map]',
      numberTag = '[object Number]',
      objectTag = '[object Object]',
      regexpTag = '[object RegExp]',
      setTag = '[object Set]',
      stringTag = '[object String]',
      weakMapTag = '[object WeakMap]';

  var arrayBufferTag = '[object ArrayBuffer]',
      dataViewTag = '[object DataView]',
      float32Tag = '[object Float32Array]',
      float64Tag = '[object Float64Array]',
      int8Tag = '[object Int8Array]',
      int16Tag = '[object Int16Array]',
      int32Tag = '[object Int32Array]',
      uint8Tag = '[object Uint8Array]',
      uint8ClampedTag = '[object Uint8ClampedArray]',
      uint16Tag = '[object Uint16Array]',
      uint32Tag = '[object Uint32Array]';

  /** Used to identify `toStringTag` values of typed arrays. */
  var typedArrayTags = {};
  typedArrayTags[float32Tag] = typedArrayTags[float64Tag] =
  typedArrayTags[int8Tag] = typedArrayTags[int16Tag] =
  typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] =
  typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] =
  typedArrayTags[uint32Tag] = true;
  typedArrayTags[argsTag$1] = typedArrayTags[arrayTag] =
  typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] =
  typedArrayTags[dataViewTag] = typedArrayTags[dateTag] =
  typedArrayTags[errorTag] = typedArrayTags[funcTag$1] =
  typedArrayTags[mapTag] = typedArrayTags[numberTag] =
  typedArrayTags[objectTag] = typedArrayTags[regexpTag] =
  typedArrayTags[setTag] = typedArrayTags[stringTag] =
  typedArrayTags[weakMapTag] = false;

  /**
   * The base implementation of `_.isTypedArray` without Node.js optimizations.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   */
  function baseIsTypedArray(value) {
    return isObjectLike(value) &&
      isLength(value.length) && !!typedArrayTags[baseGetTag(value)];
  }

  /**
   * The base implementation of `_.unary` without support for storing metadata.
   *
   * @private
   * @param {Function} func The function to cap arguments for.
   * @returns {Function} Returns the new capped function.
   */
  function baseUnary(func) {
    return function(value) {
      return func(value);
    };
  }

  /** Detect free variable `exports`. */
  var freeExports$1 = typeof exports == 'object' && exports && !exports.nodeType && exports;

  /** Detect free variable `module`. */
  var freeModule$1 = freeExports$1 && typeof module == 'object' && module && !module.nodeType && module;

  /** Detect the popular CommonJS extension `module.exports`. */
  var moduleExports$1 = freeModule$1 && freeModule$1.exports === freeExports$1;

  /** Detect free variable `process` from Node.js. */
  var freeProcess = moduleExports$1 && freeGlobal.process;

  /** Used to access faster Node.js helpers. */
  var nodeUtil = (function() {
    try {
      // Use `util.types` for Node.js 10+.
      var types = freeModule$1 && freeModule$1.require && freeModule$1.require('util').types;

      if (types) {
        return types;
      }

      // Legacy `process.binding('util')` for Node.js < 10.
      return freeProcess && freeProcess.binding && freeProcess.binding('util');
    } catch (e) {}
  }());

  /* Node.js helper references. */
  var nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;

  /**
   * Checks if `value` is classified as a typed array.
   *
   * @static
   * @memberOf _
   * @since 3.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a typed array, else `false`.
   * @example
   *
   * _.isTypedArray(new Uint8Array);
   * // => true
   *
   * _.isTypedArray([]);
   * // => false
   */
  var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;

  /** Used for built-in method references. */
  var objectProto$5 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$3 = objectProto$5.hasOwnProperty;

  /**
   * Creates an array of the enumerable property names of the array-like `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @param {boolean} inherited Specify returning inherited property names.
   * @returns {Array} Returns the array of property names.
   */
  function arrayLikeKeys(value, inherited) {
    var isArr = isArray(value),
        isArg = !isArr && isArguments(value),
        isBuff = !isArr && !isArg && isBuffer(value),
        isType = !isArr && !isArg && !isBuff && isTypedArray(value),
        skipIndexes = isArr || isArg || isBuff || isType,
        result = skipIndexes ? baseTimes(value.length, String) : [],
        length = result.length;

    for (var key in value) {
      if ((inherited || hasOwnProperty$3.call(value, key)) &&
          !(skipIndexes && (
             // Safari 9 has enumerable `arguments.length` in strict mode.
             key == 'length' ||
             // Node.js 0.10 has enumerable non-index properties on buffers.
             (isBuff && (key == 'offset' || key == 'parent')) ||
             // PhantomJS 2 has enumerable non-index properties on typed arrays.
             (isType && (key == 'buffer' || key == 'byteLength' || key == 'byteOffset')) ||
             // Skip index properties.
             isIndex(key, length)
          ))) {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Creates a unary function that invokes `func` with its argument transformed.
   *
   * @private
   * @param {Function} func The function to wrap.
   * @param {Function} transform The argument transform.
   * @returns {Function} Returns the new function.
   */
  function overArg(func, transform) {
    return function(arg) {
      return func(transform(arg));
    };
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeKeys = overArg(Object.keys, Object);

  /** Used for built-in method references. */
  var objectProto$6 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$4 = objectProto$6.hasOwnProperty;

  /**
   * The base implementation of `_.keys` which doesn't treat sparse arrays as dense.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   */
  function baseKeys(object) {
    if (!isPrototype(object)) {
      return nativeKeys(object);
    }
    var result = [];
    for (var key in Object(object)) {
      if (hasOwnProperty$4.call(object, key) && key != 'constructor') {
        result.push(key);
      }
    }
    return result;
  }

  /**
   * Creates an array of the own enumerable property names of `object`.
   *
   * **Note:** Non-object values are coerced to objects. See the
   * [ES spec](http://ecma-international.org/ecma-262/7.0/#sec-object.keys)
   * for more details.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.keys(new Foo);
   * // => ['a', 'b'] (iteration order is not guaranteed)
   *
   * _.keys('hi');
   * // => ['0', '1']
   */
  function keys(object) {
    return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
  }

  /** Used to match property names within property paths. */
  var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
      reIsPlainProp = /^\w*$/;

  /**
   * Checks if `value` is a property name and not a property path.
   *
   * @private
   * @param {*} value The value to check.
   * @param {Object} [object] The object to query keys on.
   * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
   */
  function isKey(value, object) {
    if (isArray(value)) {
      return false;
    }
    var type = typeof value;
    if (type == 'number' || type == 'symbol' || type == 'boolean' ||
        value == null || isSymbol(value)) {
      return true;
    }
    return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
      (object != null && value in Object(object));
  }

  /* Built-in method references that are verified to be native. */
  var nativeCreate = getNative(Object, 'create');

  /**
   * Removes all key-value entries from the hash.
   *
   * @private
   * @name clear
   * @memberOf Hash
   */
  function hashClear() {
    this.__data__ = nativeCreate ? nativeCreate(null) : {};
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the hash.
   *
   * @private
   * @name delete
   * @memberOf Hash
   * @param {Object} hash The hash to modify.
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function hashDelete(key) {
    var result = this.has(key) && delete this.__data__[key];
    this.size -= result ? 1 : 0;
    return result;
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED = '__lodash_hash_undefined__';

  /** Used for built-in method references. */
  var objectProto$7 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$5 = objectProto$7.hasOwnProperty;

  /**
   * Gets the hash value for `key`.
   *
   * @private
   * @name get
   * @memberOf Hash
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function hashGet(key) {
    var data = this.__data__;
    if (nativeCreate) {
      var result = data[key];
      return result === HASH_UNDEFINED ? undefined : result;
    }
    return hasOwnProperty$5.call(data, key) ? data[key] : undefined;
  }

  /** Used for built-in method references. */
  var objectProto$8 = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$6 = objectProto$8.hasOwnProperty;

  /**
   * Checks if a hash value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Hash
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function hashHas(key) {
    var data = this.__data__;
    return nativeCreate ? (data[key] !== undefined) : hasOwnProperty$6.call(data, key);
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$1 = '__lodash_hash_undefined__';

  /**
   * Sets the hash `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Hash
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the hash instance.
   */
  function hashSet(key, value) {
    var data = this.__data__;
    this.size += this.has(key) ? 0 : 1;
    data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED$1 : value;
    return this;
  }

  /**
   * Creates a hash object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Hash(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `Hash`.
  Hash.prototype.clear = hashClear;
  Hash.prototype['delete'] = hashDelete;
  Hash.prototype.get = hashGet;
  Hash.prototype.has = hashHas;
  Hash.prototype.set = hashSet;

  /**
   * Removes all key-value entries from the list cache.
   *
   * @private
   * @name clear
   * @memberOf ListCache
   */
  function listCacheClear() {
    this.__data__ = [];
    this.size = 0;
  }

  /**
   * Gets the index at which the `key` is found in `array` of key-value pairs.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {*} key The key to search for.
   * @returns {number} Returns the index of the matched value, else `-1`.
   */
  function assocIndexOf(array, key) {
    var length = array.length;
    while (length--) {
      if (eq(array[length][0], key)) {
        return length;
      }
    }
    return -1;
  }

  /** Used for built-in method references. */
  var arrayProto = Array.prototype;

  /** Built-in value references. */
  var splice = arrayProto.splice;

  /**
   * Removes `key` and its value from the list cache.
   *
   * @private
   * @name delete
   * @memberOf ListCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function listCacheDelete(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      return false;
    }
    var lastIndex = data.length - 1;
    if (index == lastIndex) {
      data.pop();
    } else {
      splice.call(data, index, 1);
    }
    --this.size;
    return true;
  }

  /**
   * Gets the list cache value for `key`.
   *
   * @private
   * @name get
   * @memberOf ListCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function listCacheGet(key) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    return index < 0 ? undefined : data[index][1];
  }

  /**
   * Checks if a list cache value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf ListCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function listCacheHas(key) {
    return assocIndexOf(this.__data__, key) > -1;
  }

  /**
   * Sets the list cache `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf ListCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the list cache instance.
   */
  function listCacheSet(key, value) {
    var data = this.__data__,
        index = assocIndexOf(data, key);

    if (index < 0) {
      ++this.size;
      data.push([key, value]);
    } else {
      data[index][1] = value;
    }
    return this;
  }

  /**
   * Creates an list cache object.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function ListCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `ListCache`.
  ListCache.prototype.clear = listCacheClear;
  ListCache.prototype['delete'] = listCacheDelete;
  ListCache.prototype.get = listCacheGet;
  ListCache.prototype.has = listCacheHas;
  ListCache.prototype.set = listCacheSet;

  /* Built-in method references that are verified to be native. */
  var Map = getNative(root, 'Map');

  /**
   * Removes all key-value entries from the map.
   *
   * @private
   * @name clear
   * @memberOf MapCache
   */
  function mapCacheClear() {
    this.size = 0;
    this.__data__ = {
      'hash': new Hash,
      'map': new (Map || ListCache),
      'string': new Hash
    };
  }

  /**
   * Checks if `value` is suitable for use as unique object key.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
   */
  function isKeyable(value) {
    var type = typeof value;
    return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
      ? (value !== '__proto__')
      : (value === null);
  }

  /**
   * Gets the data for `map`.
   *
   * @private
   * @param {Object} map The map to query.
   * @param {string} key The reference key.
   * @returns {*} Returns the map data.
   */
  function getMapData(map, key) {
    var data = map.__data__;
    return isKeyable(key)
      ? data[typeof key == 'string' ? 'string' : 'hash']
      : data.map;
  }

  /**
   * Removes `key` and its value from the map.
   *
   * @private
   * @name delete
   * @memberOf MapCache
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function mapCacheDelete(key) {
    var result = getMapData(this, key)['delete'](key);
    this.size -= result ? 1 : 0;
    return result;
  }

  /**
   * Gets the map value for `key`.
   *
   * @private
   * @name get
   * @memberOf MapCache
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function mapCacheGet(key) {
    return getMapData(this, key).get(key);
  }

  /**
   * Checks if a map value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf MapCache
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function mapCacheHas(key) {
    return getMapData(this, key).has(key);
  }

  /**
   * Sets the map `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf MapCache
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the map cache instance.
   */
  function mapCacheSet(key, value) {
    var data = getMapData(this, key),
        size = data.size;

    data.set(key, value);
    this.size += data.size == size ? 0 : 1;
    return this;
  }

  /**
   * Creates a map cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function MapCache(entries) {
    var index = -1,
        length = entries == null ? 0 : entries.length;

    this.clear();
    while (++index < length) {
      var entry = entries[index];
      this.set(entry[0], entry[1]);
    }
  }

  // Add methods to `MapCache`.
  MapCache.prototype.clear = mapCacheClear;
  MapCache.prototype['delete'] = mapCacheDelete;
  MapCache.prototype.get = mapCacheGet;
  MapCache.prototype.has = mapCacheHas;
  MapCache.prototype.set = mapCacheSet;

  /** Error message constants. */
  var FUNC_ERROR_TEXT = 'Expected a function';

  /**
   * Creates a function that memoizes the result of `func`. If `resolver` is
   * provided, it determines the cache key for storing the result based on the
   * arguments provided to the memoized function. By default, the first argument
   * provided to the memoized function is used as the map cache key. The `func`
   * is invoked with the `this` binding of the memoized function.
   *
   * **Note:** The cache is exposed as the `cache` property on the memoized
   * function. Its creation may be customized by replacing the `_.memoize.Cache`
   * constructor with one whose instances implement the
   * [`Map`](http://ecma-international.org/ecma-262/7.0/#sec-properties-of-the-map-prototype-object)
   * method interface of `clear`, `delete`, `get`, `has`, and `set`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Function
   * @param {Function} func The function to have its output memoized.
   * @param {Function} [resolver] The function to resolve the cache key.
   * @returns {Function} Returns the new memoized function.
   * @example
   *
   * var object = { 'a': 1, 'b': 2 };
   * var other = { 'c': 3, 'd': 4 };
   *
   * var values = _.memoize(_.values);
   * values(object);
   * // => [1, 2]
   *
   * values(other);
   * // => [3, 4]
   *
   * object.a = 2;
   * values(object);
   * // => [1, 2]
   *
   * // Modify the result cache.
   * values.cache.set(object, ['a', 'b']);
   * values(object);
   * // => ['a', 'b']
   *
   * // Replace `_.memoize.Cache`.
   * _.memoize.Cache = WeakMap;
   */
  function memoize(func, resolver) {
    if (typeof func != 'function' || (resolver != null && typeof resolver != 'function')) {
      throw new TypeError(FUNC_ERROR_TEXT);
    }
    var memoized = function() {
      var args = arguments,
          key = resolver ? resolver.apply(this, args) : args[0],
          cache = memoized.cache;

      if (cache.has(key)) {
        return cache.get(key);
      }
      var result = func.apply(this, args);
      memoized.cache = cache.set(key, result) || cache;
      return result;
    };
    memoized.cache = new (memoize.Cache || MapCache);
    return memoized;
  }

  // Expose `MapCache`.
  memoize.Cache = MapCache;

  /** Used as the maximum memoize cache size. */
  var MAX_MEMOIZE_SIZE = 500;

  /**
   * A specialized version of `_.memoize` which clears the memoized function's
   * cache when it exceeds `MAX_MEMOIZE_SIZE`.
   *
   * @private
   * @param {Function} func The function to have its output memoized.
   * @returns {Function} Returns the new memoized function.
   */
  function memoizeCapped(func) {
    var result = memoize(func, function(key) {
      if (cache.size === MAX_MEMOIZE_SIZE) {
        cache.clear();
      }
      return key;
    });

    var cache = result.cache;
    return result;
  }

  /** Used to match property names within property paths. */
  var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

  /** Used to match backslashes in property paths. */
  var reEscapeChar = /\\(\\)?/g;

  /**
   * Converts `string` to a property path array.
   *
   * @private
   * @param {string} string The string to convert.
   * @returns {Array} Returns the property path array.
   */
  var stringToPath = memoizeCapped(function(string) {
    var result = [];
    if (string.charCodeAt(0) === 46 /* . */) {
      result.push('');
    }
    string.replace(rePropName, function(match, number, quote, subString) {
      result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
    });
    return result;
  });

  /**
   * Converts `value` to a string. An empty string is returned for `null`
   * and `undefined` values. The sign of `-0` is preserved.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to convert.
   * @returns {string} Returns the converted string.
   * @example
   *
   * _.toString(null);
   * // => ''
   *
   * _.toString(-0);
   * // => '-0'
   *
   * _.toString([1, 2, 3]);
   * // => '1,2,3'
   */
  function toString(value) {
    return value == null ? '' : baseToString(value);
  }

  /**
   * Casts `value` to a path array if it's not one.
   *
   * @private
   * @param {*} value The value to inspect.
   * @param {Object} [object] The object to query keys on.
   * @returns {Array} Returns the cast property path array.
   */
  function castPath(value, object) {
    if (isArray(value)) {
      return value;
    }
    return isKey(value, object) ? [value] : stringToPath(toString(value));
  }

  /** Used as references for various `Number` constants. */
  var INFINITY$2 = 1 / 0;

  /**
   * Converts `value` to a string key if it's not a string or symbol.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {string|symbol} Returns the key.
   */
  function toKey(value) {
    if (typeof value == 'string' || isSymbol(value)) {
      return value;
    }
    var result = (value + '');
    return (result == '0' && (1 / value) == -INFINITY$2) ? '-0' : result;
  }

  /**
   * The base implementation of `_.get` without support for default values.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @returns {*} Returns the resolved value.
   */
  function baseGet(object, path) {
    path = castPath(path, object);

    var index = 0,
        length = path.length;

    while (object != null && index < length) {
      object = object[toKey(path[index++])];
    }
    return (index && index == length) ? object : undefined;
  }

  /**
   * Gets the value at `path` of `object`. If the resolved value is
   * `undefined`, the `defaultValue` is returned in its place.
   *
   * @static
   * @memberOf _
   * @since 3.7.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path of the property to get.
   * @param {*} [defaultValue] The value returned for `undefined` resolved values.
   * @returns {*} Returns the resolved value.
   * @example
   *
   * var object = { 'a': [{ 'b': { 'c': 3 } }] };
   *
   * _.get(object, 'a[0].b.c');
   * // => 3
   *
   * _.get(object, ['a', '0', 'b', 'c']);
   * // => 3
   *
   * _.get(object, 'a.b.c', 'default');
   * // => 'default'
   */
  function get(object, path, defaultValue) {
    var result = object == null ? undefined : baseGet(object, path);
    return result === undefined ? defaultValue : result;
  }

  /**
   * Appends the elements of `values` to `array`.
   *
   * @private
   * @param {Array} array The array to modify.
   * @param {Array} values The values to append.
   * @returns {Array} Returns `array`.
   */
  function arrayPush(array, values) {
    var index = -1,
        length = values.length,
        offset = array.length;

    while (++index < length) {
      array[offset + index] = values[index];
    }
    return array;
  }

  /** Built-in value references. */
  var spreadableSymbol = Symbol$1 ? Symbol$1.isConcatSpreadable : undefined;

  /**
   * Checks if `value` is a flattenable `arguments` object or array.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is flattenable, else `false`.
   */
  function isFlattenable(value) {
    return isArray(value) || isArguments(value) ||
      !!(spreadableSymbol && value && value[spreadableSymbol]);
  }

  /**
   * The base implementation of `_.flatten` with support for restricting flattening.
   *
   * @private
   * @param {Array} array The array to flatten.
   * @param {number} depth The maximum recursion depth.
   * @param {boolean} [predicate=isFlattenable] The function invoked per iteration.
   * @param {boolean} [isStrict] Restrict to values that pass `predicate` checks.
   * @param {Array} [result=[]] The initial result value.
   * @returns {Array} Returns the new flattened array.
   */
  function baseFlatten(array, depth, predicate, isStrict, result) {
    var index = -1,
        length = array.length;

    predicate || (predicate = isFlattenable);
    result || (result = []);

    while (++index < length) {
      var value = array[index];
      if (depth > 0 && predicate(value)) {
        if (depth > 1) {
          // Recursively flatten arrays (susceptible to call stack limits).
          baseFlatten(value, depth - 1, predicate, isStrict, result);
        } else {
          arrayPush(result, value);
        }
      } else if (!isStrict) {
        result[result.length] = value;
      }
    }
    return result;
  }

  /**
   * A specialized version of `_.reduce` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @param {boolean} [initAccum] Specify using the first element of `array` as
   *  the initial value.
   * @returns {*} Returns the accumulated value.
   */
  function arrayReduce(array, iteratee, accumulator, initAccum) {
    var index = -1,
        length = array == null ? 0 : array.length;

    if (initAccum && length) {
      accumulator = array[++index];
    }
    while (++index < length) {
      accumulator = iteratee(accumulator, array[index], index, array);
    }
    return accumulator;
  }

  /**
   * Removes all key-value entries from the stack.
   *
   * @private
   * @name clear
   * @memberOf Stack
   */
  function stackClear() {
    this.__data__ = new ListCache;
    this.size = 0;
  }

  /**
   * Removes `key` and its value from the stack.
   *
   * @private
   * @name delete
   * @memberOf Stack
   * @param {string} key The key of the value to remove.
   * @returns {boolean} Returns `true` if the entry was removed, else `false`.
   */
  function stackDelete(key) {
    var data = this.__data__,
        result = data['delete'](key);

    this.size = data.size;
    return result;
  }

  /**
   * Gets the stack value for `key`.
   *
   * @private
   * @name get
   * @memberOf Stack
   * @param {string} key The key of the value to get.
   * @returns {*} Returns the entry value.
   */
  function stackGet(key) {
    return this.__data__.get(key);
  }

  /**
   * Checks if a stack value for `key` exists.
   *
   * @private
   * @name has
   * @memberOf Stack
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function stackHas(key) {
    return this.__data__.has(key);
  }

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE = 200;

  /**
   * Sets the stack `key` to `value`.
   *
   * @private
   * @name set
   * @memberOf Stack
   * @param {string} key The key of the value to set.
   * @param {*} value The value to set.
   * @returns {Object} Returns the stack cache instance.
   */
  function stackSet(key, value) {
    var data = this.__data__;
    if (data instanceof ListCache) {
      var pairs = data.__data__;
      if (!Map || (pairs.length < LARGE_ARRAY_SIZE - 1)) {
        pairs.push([key, value]);
        this.size = ++data.size;
        return this;
      }
      data = this.__data__ = new MapCache(pairs);
    }
    data.set(key, value);
    this.size = data.size;
    return this;
  }

  /**
   * Creates a stack cache object to store key-value pairs.
   *
   * @private
   * @constructor
   * @param {Array} [entries] The key-value pairs to cache.
   */
  function Stack(entries) {
    var data = this.__data__ = new ListCache(entries);
    this.size = data.size;
  }

  // Add methods to `Stack`.
  Stack.prototype.clear = stackClear;
  Stack.prototype['delete'] = stackDelete;
  Stack.prototype.get = stackGet;
  Stack.prototype.has = stackHas;
  Stack.prototype.set = stackSet;

  /**
   * A specialized version of `_.filter` for arrays without support for
   * iteratee shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {Array} Returns the new filtered array.
   */
  function arrayFilter(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (predicate(value, index, array)) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /**
   * This method returns a new empty array.
   *
   * @static
   * @memberOf _
   * @since 4.13.0
   * @category Util
   * @returns {Array} Returns the new empty array.
   * @example
   *
   * var arrays = _.times(2, _.stubArray);
   *
   * console.log(arrays);
   * // => [[], []]
   *
   * console.log(arrays[0] === arrays[1]);
   * // => false
   */
  function stubArray() {
    return [];
  }

  /** Used for built-in method references. */
  var objectProto$9 = Object.prototype;

  /** Built-in value references. */
  var propertyIsEnumerable$1 = objectProto$9.propertyIsEnumerable;

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeGetSymbols = Object.getOwnPropertySymbols;

  /**
   * Creates an array of the own enumerable symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of symbols.
   */
  var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
    if (object == null) {
      return [];
    }
    object = Object(object);
    return arrayFilter(nativeGetSymbols(object), function(symbol) {
      return propertyIsEnumerable$1.call(object, symbol);
    });
  };

  /**
   * The base implementation of `getAllKeys` and `getAllKeysIn` which uses
   * `keysFunc` and `symbolsFunc` to get the enumerable property names and
   * symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @param {Function} symbolsFunc The function to get the symbols of `object`.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function baseGetAllKeys(object, keysFunc, symbolsFunc) {
    var result = keysFunc(object);
    return isArray(object) ? result : arrayPush(result, symbolsFunc(object));
  }

  /**
   * Creates an array of own enumerable property names and symbols of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property names and symbols.
   */
  function getAllKeys(object) {
    return baseGetAllKeys(object, keys, getSymbols);
  }

  /* Built-in method references that are verified to be native. */
  var DataView = getNative(root, 'DataView');

  /* Built-in method references that are verified to be native. */
  var Promise = getNative(root, 'Promise');

  /* Built-in method references that are verified to be native. */
  var Set = getNative(root, 'Set');

  /** `Object#toString` result references. */
  var mapTag$1 = '[object Map]',
      objectTag$1 = '[object Object]',
      promiseTag = '[object Promise]',
      setTag$1 = '[object Set]',
      weakMapTag$1 = '[object WeakMap]';

  var dataViewTag$1 = '[object DataView]';

  /** Used to detect maps, sets, and weakmaps. */
  var dataViewCtorString = toSource(DataView),
      mapCtorString = toSource(Map),
      promiseCtorString = toSource(Promise),
      setCtorString = toSource(Set),
      weakMapCtorString = toSource(WeakMap);

  /**
   * Gets the `toStringTag` of `value`.
   *
   * @private
   * @param {*} value The value to query.
   * @returns {string} Returns the `toStringTag`.
   */
  var getTag = baseGetTag;

  // Fallback for data views, maps, sets, and weak maps in IE 11 and promises in Node.js < 6.
  if ((DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag$1) ||
      (Map && getTag(new Map) != mapTag$1) ||
      (Promise && getTag(Promise.resolve()) != promiseTag) ||
      (Set && getTag(new Set) != setTag$1) ||
      (WeakMap && getTag(new WeakMap) != weakMapTag$1)) {
    getTag = function(value) {
      var result = baseGetTag(value),
          Ctor = result == objectTag$1 ? value.constructor : undefined,
          ctorString = Ctor ? toSource(Ctor) : '';

      if (ctorString) {
        switch (ctorString) {
          case dataViewCtorString: return dataViewTag$1;
          case mapCtorString: return mapTag$1;
          case promiseCtorString: return promiseTag;
          case setCtorString: return setTag$1;
          case weakMapCtorString: return weakMapTag$1;
        }
      }
      return result;
    };
  }

  var getTag$1 = getTag;

  /** Built-in value references. */
  var Uint8Array = root.Uint8Array;

  /**
   * Creates an array with all falsey values removed. The values `false`, `null`,
   * `0`, `""`, `undefined`, and `NaN` are falsey.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to compact.
   * @returns {Array} Returns the new array of filtered values.
   * @example
   *
   * _.compact([0, 1, false, 2, '', 3]);
   * // => [1, 2, 3]
   */
  function compact(array) {
    var index = -1,
        length = array == null ? 0 : array.length,
        resIndex = 0,
        result = [];

    while (++index < length) {
      var value = array[index];
      if (value) {
        result[resIndex++] = value;
      }
    }
    return result;
  }

  /** Used to stand-in for `undefined` hash values. */
  var HASH_UNDEFINED$2 = '__lodash_hash_undefined__';

  /**
   * Adds `value` to the array cache.
   *
   * @private
   * @name add
   * @memberOf SetCache
   * @alias push
   * @param {*} value The value to cache.
   * @returns {Object} Returns the cache instance.
   */
  function setCacheAdd(value) {
    this.__data__.set(value, HASH_UNDEFINED$2);
    return this;
  }

  /**
   * Checks if `value` is in the array cache.
   *
   * @private
   * @name has
   * @memberOf SetCache
   * @param {*} value The value to search for.
   * @returns {number} Returns `true` if `value` is found, else `false`.
   */
  function setCacheHas(value) {
    return this.__data__.has(value);
  }

  /**
   *
   * Creates an array cache object to store unique values.
   *
   * @private
   * @constructor
   * @param {Array} [values] The values to cache.
   */
  function SetCache(values) {
    var index = -1,
        length = values == null ? 0 : values.length;

    this.__data__ = new MapCache;
    while (++index < length) {
      this.add(values[index]);
    }
  }

  // Add methods to `SetCache`.
  SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
  SetCache.prototype.has = setCacheHas;

  /**
   * A specialized version of `_.some` for arrays without support for iteratee
   * shorthands.
   *
   * @private
   * @param {Array} [array] The array to iterate over.
   * @param {Function} predicate The function invoked per iteration.
   * @returns {boolean} Returns `true` if any element passes the predicate check,
   *  else `false`.
   */
  function arraySome(array, predicate) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (predicate(array[index], index, array)) {
        return true;
      }
    }
    return false;
  }

  /**
   * Checks if a `cache` value for `key` exists.
   *
   * @private
   * @param {Object} cache The cache to query.
   * @param {string} key The key of the entry to check.
   * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
   */
  function cacheHas(cache, key) {
    return cache.has(key);
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG = 1,
      COMPARE_UNORDERED_FLAG = 2;

  /**
   * A specialized version of `baseIsEqualDeep` for arrays with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Array} array The array to compare.
   * @param {Array} other The other array to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `array` and `other` objects.
   * @returns {boolean} Returns `true` if the arrays are equivalent, else `false`.
   */
  function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG,
        arrLength = array.length,
        othLength = other.length;

    if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
      return false;
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(array);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var index = -1,
        result = true,
        seen = (bitmask & COMPARE_UNORDERED_FLAG) ? new SetCache : undefined;

    stack.set(array, other);
    stack.set(other, array);

    // Ignore non-index properties.
    while (++index < arrLength) {
      var arrValue = array[index],
          othValue = other[index];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, arrValue, index, other, array, stack)
          : customizer(arrValue, othValue, index, array, other, stack);
      }
      if (compared !== undefined) {
        if (compared) {
          continue;
        }
        result = false;
        break;
      }
      // Recursively compare arrays (susceptible to call stack limits).
      if (seen) {
        if (!arraySome(other, function(othValue, othIndex) {
              if (!cacheHas(seen, othIndex) &&
                  (arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
          result = false;
          break;
        }
      } else if (!(
            arrValue === othValue ||
              equalFunc(arrValue, othValue, bitmask, customizer, stack)
          )) {
        result = false;
        break;
      }
    }
    stack['delete'](array);
    stack['delete'](other);
    return result;
  }

  /**
   * Converts `map` to its key-value pairs.
   *
   * @private
   * @param {Object} map The map to convert.
   * @returns {Array} Returns the key-value pairs.
   */
  function mapToArray(map) {
    var index = -1,
        result = Array(map.size);

    map.forEach(function(value, key) {
      result[++index] = [key, value];
    });
    return result;
  }

  /**
   * Converts `set` to an array of its values.
   *
   * @private
   * @param {Object} set The set to convert.
   * @returns {Array} Returns the values.
   */
  function setToArray(set) {
    var index = -1,
        result = Array(set.size);

    set.forEach(function(value) {
      result[++index] = value;
    });
    return result;
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$1 = 1,
      COMPARE_UNORDERED_FLAG$1 = 2;

  /** `Object#toString` result references. */
  var boolTag$1 = '[object Boolean]',
      dateTag$1 = '[object Date]',
      errorTag$1 = '[object Error]',
      mapTag$2 = '[object Map]',
      numberTag$1 = '[object Number]',
      regexpTag$1 = '[object RegExp]',
      setTag$2 = '[object Set]',
      stringTag$1 = '[object String]',
      symbolTag$1 = '[object Symbol]';

  var arrayBufferTag$1 = '[object ArrayBuffer]',
      dataViewTag$2 = '[object DataView]';

  /** Used to convert symbols to primitives and strings. */
  var symbolProto$1 = Symbol$1 ? Symbol$1.prototype : undefined,
      symbolValueOf = symbolProto$1 ? symbolProto$1.valueOf : undefined;

  /**
   * A specialized version of `baseIsEqualDeep` for comparing objects of
   * the same `toStringTag`.
   *
   * **Note:** This function only supports comparing values with tags of
   * `Boolean`, `Date`, `Error`, `Number`, `RegExp`, or `String`.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {string} tag The `toStringTag` of the objects to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
    switch (tag) {
      case dataViewTag$2:
        if ((object.byteLength != other.byteLength) ||
            (object.byteOffset != other.byteOffset)) {
          return false;
        }
        object = object.buffer;
        other = other.buffer;

      case arrayBufferTag$1:
        if ((object.byteLength != other.byteLength) ||
            !equalFunc(new Uint8Array(object), new Uint8Array(other))) {
          return false;
        }
        return true;

      case boolTag$1:
      case dateTag$1:
      case numberTag$1:
        // Coerce booleans to `1` or `0` and dates to milliseconds.
        // Invalid dates are coerced to `NaN`.
        return eq(+object, +other);

      case errorTag$1:
        return object.name == other.name && object.message == other.message;

      case regexpTag$1:
      case stringTag$1:
        // Coerce regexes to strings and treat strings, primitives and objects,
        // as equal. See http://www.ecma-international.org/ecma-262/7.0/#sec-regexp.prototype.tostring
        // for more details.
        return object == (other + '');

      case mapTag$2:
        var convert = mapToArray;

      case setTag$2:
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG$1;
        convert || (convert = setToArray);

        if (object.size != other.size && !isPartial) {
          return false;
        }
        // Assume cyclic values are equal.
        var stacked = stack.get(object);
        if (stacked) {
          return stacked == other;
        }
        bitmask |= COMPARE_UNORDERED_FLAG$1;

        // Recursively compare objects (susceptible to call stack limits).
        stack.set(object, other);
        var result = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
        stack['delete'](object);
        return result;

      case symbolTag$1:
        if (symbolValueOf) {
          return symbolValueOf.call(object) == symbolValueOf.call(other);
        }
    }
    return false;
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$2 = 1;

  /** Used for built-in method references. */
  var objectProto$a = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$7 = objectProto$a.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqualDeep` for objects with support for
   * partial deep comparisons.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} stack Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
    var isPartial = bitmask & COMPARE_PARTIAL_FLAG$2,
        objProps = getAllKeys(object),
        objLength = objProps.length,
        othProps = getAllKeys(other),
        othLength = othProps.length;

    if (objLength != othLength && !isPartial) {
      return false;
    }
    var index = objLength;
    while (index--) {
      var key = objProps[index];
      if (!(isPartial ? key in other : hasOwnProperty$7.call(other, key))) {
        return false;
      }
    }
    // Assume cyclic values are equal.
    var stacked = stack.get(object);
    if (stacked && stack.get(other)) {
      return stacked == other;
    }
    var result = true;
    stack.set(object, other);
    stack.set(other, object);

    var skipCtor = isPartial;
    while (++index < objLength) {
      key = objProps[index];
      var objValue = object[key],
          othValue = other[key];

      if (customizer) {
        var compared = isPartial
          ? customizer(othValue, objValue, key, other, object, stack)
          : customizer(objValue, othValue, key, object, other, stack);
      }
      // Recursively compare objects (susceptible to call stack limits).
      if (!(compared === undefined
            ? (objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack))
            : compared
          )) {
        result = false;
        break;
      }
      skipCtor || (skipCtor = key == 'constructor');
    }
    if (result && !skipCtor) {
      var objCtor = object.constructor,
          othCtor = other.constructor;

      // Non `Object` object instances with different constructors are not equal.
      if (objCtor != othCtor &&
          ('constructor' in object && 'constructor' in other) &&
          !(typeof objCtor == 'function' && objCtor instanceof objCtor &&
            typeof othCtor == 'function' && othCtor instanceof othCtor)) {
        result = false;
      }
    }
    stack['delete'](object);
    stack['delete'](other);
    return result;
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$3 = 1;

  /** `Object#toString` result references. */
  var argsTag$2 = '[object Arguments]',
      arrayTag$1 = '[object Array]',
      objectTag$2 = '[object Object]';

  /** Used for built-in method references. */
  var objectProto$b = Object.prototype;

  /** Used to check objects for own properties. */
  var hasOwnProperty$8 = objectProto$b.hasOwnProperty;

  /**
   * A specialized version of `baseIsEqual` for arrays and objects which performs
   * deep comparisons and tracks traversed objects enabling objects with circular
   * references to be compared.
   *
   * @private
   * @param {Object} object The object to compare.
   * @param {Object} other The other object to compare.
   * @param {number} bitmask The bitmask flags. See `baseIsEqual` for more details.
   * @param {Function} customizer The function to customize comparisons.
   * @param {Function} equalFunc The function to determine equivalents of values.
   * @param {Object} [stack] Tracks traversed `object` and `other` objects.
   * @returns {boolean} Returns `true` if the objects are equivalent, else `false`.
   */
  function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
    var objIsArr = isArray(object),
        othIsArr = isArray(other),
        objTag = objIsArr ? arrayTag$1 : getTag$1(object),
        othTag = othIsArr ? arrayTag$1 : getTag$1(other);

    objTag = objTag == argsTag$2 ? objectTag$2 : objTag;
    othTag = othTag == argsTag$2 ? objectTag$2 : othTag;

    var objIsObj = objTag == objectTag$2,
        othIsObj = othTag == objectTag$2,
        isSameTag = objTag == othTag;

    if (isSameTag && isBuffer(object)) {
      if (!isBuffer(other)) {
        return false;
      }
      objIsArr = true;
      objIsObj = false;
    }
    if (isSameTag && !objIsObj) {
      stack || (stack = new Stack);
      return (objIsArr || isTypedArray(object))
        ? equalArrays(object, other, bitmask, customizer, equalFunc, stack)
        : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
    }
    if (!(bitmask & COMPARE_PARTIAL_FLAG$3)) {
      var objIsWrapped = objIsObj && hasOwnProperty$8.call(object, '__wrapped__'),
          othIsWrapped = othIsObj && hasOwnProperty$8.call(other, '__wrapped__');

      if (objIsWrapped || othIsWrapped) {
        var objUnwrapped = objIsWrapped ? object.value() : object,
            othUnwrapped = othIsWrapped ? other.value() : other;

        stack || (stack = new Stack);
        return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
      }
    }
    if (!isSameTag) {
      return false;
    }
    stack || (stack = new Stack);
    return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
  }

  /**
   * The base implementation of `_.isEqual` which supports partial comparisons
   * and tracks traversed objects.
   *
   * @private
   * @param {*} value The value to compare.
   * @param {*} other The other value to compare.
   * @param {boolean} bitmask The bitmask flags.
   *  1 - Unordered comparison
   *  2 - Partial comparison
   * @param {Function} [customizer] The function to customize comparisons.
   * @param {Object} [stack] Tracks traversed `value` and `other` objects.
   * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
   */
  function baseIsEqual(value, other, bitmask, customizer, stack) {
    if (value === other) {
      return true;
    }
    if (value == null || other == null || (!isObjectLike(value) && !isObjectLike(other))) {
      return value !== value && other !== other;
    }
    return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$4 = 1,
      COMPARE_UNORDERED_FLAG$2 = 2;

  /**
   * The base implementation of `_.isMatch` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to inspect.
   * @param {Object} source The object of property values to match.
   * @param {Array} matchData The property names, values, and compare flags to match.
   * @param {Function} [customizer] The function to customize comparisons.
   * @returns {boolean} Returns `true` if `object` is a match, else `false`.
   */
  function baseIsMatch(object, source, matchData, customizer) {
    var index = matchData.length,
        length = index,
        noCustomizer = !customizer;

    if (object == null) {
      return !length;
    }
    object = Object(object);
    while (index--) {
      var data = matchData[index];
      if ((noCustomizer && data[2])
            ? data[1] !== object[data[0]]
            : !(data[0] in object)
          ) {
        return false;
      }
    }
    while (++index < length) {
      data = matchData[index];
      var key = data[0],
          objValue = object[key],
          srcValue = data[1];

      if (noCustomizer && data[2]) {
        if (objValue === undefined && !(key in object)) {
          return false;
        }
      } else {
        var stack = new Stack;
        if (customizer) {
          var result = customizer(objValue, srcValue, key, object, source, stack);
        }
        if (!(result === undefined
              ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$4 | COMPARE_UNORDERED_FLAG$2, customizer, stack)
              : result
            )) {
          return false;
        }
      }
    }
    return true;
  }

  /**
   * Checks if `value` is suitable for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` if suitable for strict
   *  equality comparisons, else `false`.
   */
  function isStrictComparable(value) {
    return value === value && !isObject(value);
  }

  /**
   * Gets the property names, values, and compare flags of `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @returns {Array} Returns the match data of `object`.
   */
  function getMatchData(object) {
    var result = keys(object),
        length = result.length;

    while (length--) {
      var key = result[length],
          value = object[key];

      result[length] = [key, value, isStrictComparable(value)];
    }
    return result;
  }

  /**
   * A specialized version of `matchesProperty` for source values suitable
   * for strict equality comparisons, i.e. `===`.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function matchesStrictComparable(key, srcValue) {
    return function(object) {
      if (object == null) {
        return false;
      }
      return object[key] === srcValue &&
        (srcValue !== undefined || (key in Object(object)));
    };
  }

  /**
   * The base implementation of `_.matches` which doesn't clone `source`.
   *
   * @private
   * @param {Object} source The object of property values to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatches(source) {
    var matchData = getMatchData(source);
    if (matchData.length == 1 && matchData[0][2]) {
      return matchesStrictComparable(matchData[0][0], matchData[0][1]);
    }
    return function(object) {
      return object === source || baseIsMatch(object, source, matchData);
    };
  }

  /**
   * The base implementation of `_.hasIn` without support for deep paths.
   *
   * @private
   * @param {Object} [object] The object to query.
   * @param {Array|string} key The key to check.
   * @returns {boolean} Returns `true` if `key` exists, else `false`.
   */
  function baseHasIn(object, key) {
    return object != null && key in Object(object);
  }

  /**
   * Checks if `path` exists on `object`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @param {Function} hasFunc The function to check properties.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   */
  function hasPath(object, path, hasFunc) {
    path = castPath(path, object);

    var index = -1,
        length = path.length,
        result = false;

    while (++index < length) {
      var key = toKey(path[index]);
      if (!(result = object != null && hasFunc(object, key))) {
        break;
      }
      object = object[key];
    }
    if (result || ++index != length) {
      return result;
    }
    length = object == null ? 0 : object.length;
    return !!length && isLength(length) && isIndex(key, length) &&
      (isArray(object) || isArguments(object));
  }

  /**
   * Checks if `path` is a direct or inherited property of `object`.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Object
   * @param {Object} object The object to query.
   * @param {Array|string} path The path to check.
   * @returns {boolean} Returns `true` if `path` exists, else `false`.
   * @example
   *
   * var object = _.create({ 'a': _.create({ 'b': 2 }) });
   *
   * _.hasIn(object, 'a');
   * // => true
   *
   * _.hasIn(object, 'a.b');
   * // => true
   *
   * _.hasIn(object, ['a', 'b']);
   * // => true
   *
   * _.hasIn(object, 'b');
   * // => false
   */
  function hasIn(object, path) {
    return object != null && hasPath(object, path, baseHasIn);
  }

  /** Used to compose bitmasks for value comparisons. */
  var COMPARE_PARTIAL_FLAG$5 = 1,
      COMPARE_UNORDERED_FLAG$3 = 2;

  /**
   * The base implementation of `_.matchesProperty` which doesn't clone `srcValue`.
   *
   * @private
   * @param {string} path The path of the property to get.
   * @param {*} srcValue The value to match.
   * @returns {Function} Returns the new spec function.
   */
  function baseMatchesProperty(path, srcValue) {
    if (isKey(path) && isStrictComparable(srcValue)) {
      return matchesStrictComparable(toKey(path), srcValue);
    }
    return function(object) {
      var objValue = get(object, path);
      return (objValue === undefined && objValue === srcValue)
        ? hasIn(object, path)
        : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG$5 | COMPARE_UNORDERED_FLAG$3);
    };
  }

  /**
   * The base implementation of `_.property` without support for deep paths.
   *
   * @private
   * @param {string} key The key of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function baseProperty(key) {
    return function(object) {
      return object == null ? undefined : object[key];
    };
  }

  /**
   * A specialized version of `baseProperty` which supports deep paths.
   *
   * @private
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   */
  function basePropertyDeep(path) {
    return function(object) {
      return baseGet(object, path);
    };
  }

  /**
   * Creates a function that returns the value at `path` of a given object.
   *
   * @static
   * @memberOf _
   * @since 2.4.0
   * @category Util
   * @param {Array|string} path The path of the property to get.
   * @returns {Function} Returns the new accessor function.
   * @example
   *
   * var objects = [
   *   { 'a': { 'b': 2 } },
   *   { 'a': { 'b': 1 } }
   * ];
   *
   * _.map(objects, _.property('a.b'));
   * // => [2, 1]
   *
   * _.map(_.sortBy(objects, _.property(['a', 'b'])), 'a.b');
   * // => [1, 2]
   */
  function property(path) {
    return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
  }

  /**
   * The base implementation of `_.iteratee`.
   *
   * @private
   * @param {*} [value=_.identity] The value to convert to an iteratee.
   * @returns {Function} Returns the iteratee.
   */
  function baseIteratee(value) {
    // Don't store the `typeof` result in a variable to avoid a JIT bug in Safari 9.
    // See https://bugs.webkit.org/show_bug.cgi?id=156034 for more details.
    if (typeof value == 'function') {
      return value;
    }
    if (value == null) {
      return identity;
    }
    if (typeof value == 'object') {
      return isArray(value)
        ? baseMatchesProperty(value[0], value[1])
        : baseMatches(value);
    }
    return property(value);
  }

  /**
   * Creates a base function for methods like `_.forIn` and `_.forOwn`.
   *
   * @private
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseFor(fromRight) {
    return function(object, iteratee, keysFunc) {
      var index = -1,
          iterable = Object(object),
          props = keysFunc(object),
          length = props.length;

      while (length--) {
        var key = props[fromRight ? length : ++index];
        if (iteratee(iterable[key], key, iterable) === false) {
          break;
        }
      }
      return object;
    };
  }

  /**
   * The base implementation of `baseForOwn` which iterates over `object`
   * properties returned by `keysFunc` and invokes `iteratee` for each property.
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {Function} keysFunc The function to get the keys of `object`.
   * @returns {Object} Returns `object`.
   */
  var baseFor = createBaseFor();

  /**
   * The base implementation of `_.forOwn` without support for iteratee shorthands.
   *
   * @private
   * @param {Object} object The object to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Object} Returns `object`.
   */
  function baseForOwn(object, iteratee) {
    return object && baseFor(object, iteratee, keys);
  }

  /**
   * Creates a `baseEach` or `baseEachRight` function.
   *
   * @private
   * @param {Function} eachFunc The function to iterate over a collection.
   * @param {boolean} [fromRight] Specify iterating from right to left.
   * @returns {Function} Returns the new base function.
   */
  function createBaseEach(eachFunc, fromRight) {
    return function(collection, iteratee) {
      if (collection == null) {
        return collection;
      }
      if (!isArrayLike(collection)) {
        return eachFunc(collection, iteratee);
      }
      var length = collection.length,
          index = fromRight ? length : -1,
          iterable = Object(collection);

      while ((fromRight ? index-- : ++index < length)) {
        if (iteratee(iterable[index], index, iterable) === false) {
          break;
        }
      }
      return collection;
    };
  }

  /**
   * The base implementation of `_.forEach` without support for iteratee shorthands.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   */
  var baseEach = createBaseEach(baseForOwn);

  /**
   * This method is like `_.isArrayLike` except that it also checks if `value`
   * is an object.
   *
   * @static
   * @memberOf _
   * @since 4.0.0
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is an array-like object,
   *  else `false`.
   * @example
   *
   * _.isArrayLikeObject([1, 2, 3]);
   * // => true
   *
   * _.isArrayLikeObject(document.body.children);
   * // => true
   *
   * _.isArrayLikeObject('abc');
   * // => false
   *
   * _.isArrayLikeObject(_.noop);
   * // => false
   */
  function isArrayLikeObject(value) {
    return isObjectLike(value) && isArrayLike(value);
  }

  /**
   * This function is like `arrayIncludes` except that it accepts a comparator.
   *
   * @private
   * @param {Array} [array] The array to inspect.
   * @param {*} target The value to search for.
   * @param {Function} comparator The comparator invoked per element.
   * @returns {boolean} Returns `true` if `target` is found, else `false`.
   */
  function arrayIncludesWith(array, value, comparator) {
    var index = -1,
        length = array == null ? 0 : array.length;

    while (++index < length) {
      if (comparator(value, array[index])) {
        return true;
      }
    }
    return false;
  }

  /** Used as the size to enable large array optimizations. */
  var LARGE_ARRAY_SIZE$1 = 200;

  /**
   * The base implementation of methods like `_.difference` without support
   * for excluding multiple arrays or iteratee shorthands.
   *
   * @private
   * @param {Array} array The array to inspect.
   * @param {Array} values The values to exclude.
   * @param {Function} [iteratee] The iteratee invoked per element.
   * @param {Function} [comparator] The comparator invoked per element.
   * @returns {Array} Returns the new array of filtered values.
   */
  function baseDifference(array, values, iteratee, comparator) {
    var index = -1,
        includes = arrayIncludes,
        isCommon = true,
        length = array.length,
        result = [],
        valuesLength = values.length;

    if (!length) {
      return result;
    }
    if (iteratee) {
      values = arrayMap(values, baseUnary(iteratee));
    }
    if (comparator) {
      includes = arrayIncludesWith;
      isCommon = false;
    }
    else if (values.length >= LARGE_ARRAY_SIZE$1) {
      includes = cacheHas;
      isCommon = false;
      values = new SetCache(values);
    }
    outer:
    while (++index < length) {
      var value = array[index],
          computed = iteratee == null ? value : iteratee(value);

      value = (comparator || value !== 0) ? value : 0;
      if (isCommon && computed === computed) {
        var valuesIndex = valuesLength;
        while (valuesIndex--) {
          if (values[valuesIndex] === computed) {
            continue outer;
          }
        }
        result.push(value);
      }
      else if (!includes(values, computed, comparator)) {
        result.push(value);
      }
    }
    return result;
  }

  /**
   * Creates an array of `array` values not included in the other given arrays
   * using [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * for equality comparisons. The order and references of result values are
   * determined by the first array.
   *
   * **Note:** Unlike `_.pullAll`, this method returns a new array.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Array
   * @param {Array} array The array to inspect.
   * @param {...Array} [values] The values to exclude.
   * @returns {Array} Returns the new array of filtered values.
   * @see _.without, _.xor
   * @example
   *
   * _.difference([2, 1], [2, 3]);
   * // => [1]
   */
  var difference = baseRest(function(array, values) {
    return isArrayLikeObject(array)
      ? baseDifference(array, baseFlatten(values, 1, isArrayLikeObject, true))
      : [];
  });

  /**
   * Casts `value` to `identity` if it's not a function.
   *
   * @private
   * @param {*} value The value to inspect.
   * @returns {Function} Returns cast function.
   */
  function castFunction(value) {
    return typeof value == 'function' ? value : identity;
  }

  /**
   * Iterates over elements of `collection` and invokes `iteratee` for each element.
   * The iteratee is invoked with three arguments: (value, index|key, collection).
   * Iteratee functions may exit iteration early by explicitly returning `false`.
   *
   * **Note:** As with other "Collections" methods, objects with a "length"
   * property are iterated like arrays. To avoid this behavior use `_.forIn`
   * or `_.forOwn` for object iteration.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias each
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @returns {Array|Object} Returns `collection`.
   * @see _.forEachRight
   * @example
   *
   * _.forEach([1, 2], function(value) {
   *   console.log(value);
   * });
   * // => Logs `1` then `2`.
   *
   * _.forEach({ 'a': 1, 'b': 2 }, function(value, key) {
   *   console.log(key);
   * });
   * // => Logs 'a' then 'b' (iteration order is not guaranteed).
   */
  function forEach(collection, iteratee) {
    var func = isArray(collection) ? arrayEach : baseEach;
    return func(collection, castFunction(iteratee));
  }

  /**
   * Gets the first element of `array`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @alias first
   * @category Array
   * @param {Array} array The array to query.
   * @returns {*} Returns the first element of `array`.
   * @example
   *
   * _.head([1, 2, 3]);
   * // => 1
   *
   * _.head([]);
   * // => undefined
   */
  function head(array) {
    return (array && array.length) ? array[0] : undefined;
  }

  /** `Object#toString` result references. */
  var stringTag$2 = '[object String]';

  /**
   * Checks if `value` is classified as a `String` primitive or object.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Lang
   * @param {*} value The value to check.
   * @returns {boolean} Returns `true` if `value` is a string, else `false`.
   * @example
   *
   * _.isString('abc');
   * // => true
   *
   * _.isString(1);
   * // => false
   */
  function isString(value) {
    return typeof value == 'string' ||
      (!isArray(value) && isObjectLike(value) && baseGetTag(value) == stringTag$2);
  }

  /**
   * The base implementation of `_.values` and `_.valuesIn` which creates an
   * array of `object` property values corresponding to the property names
   * of `props`.
   *
   * @private
   * @param {Object} object The object to query.
   * @param {Array} props The property names to get values for.
   * @returns {Object} Returns the array of property values.
   */
  function baseValues(object, props) {
    return arrayMap(props, function(key) {
      return object[key];
    });
  }

  /**
   * Creates an array of the own enumerable string keyed property values of `object`.
   *
   * **Note:** Non-object values are coerced to objects.
   *
   * @static
   * @since 0.1.0
   * @memberOf _
   * @category Object
   * @param {Object} object The object to query.
   * @returns {Array} Returns the array of property values.
   * @example
   *
   * function Foo() {
   *   this.a = 1;
   *   this.b = 2;
   * }
   *
   * Foo.prototype.c = 3;
   *
   * _.values(new Foo);
   * // => [1, 2] (iteration order is not guaranteed)
   *
   * _.values('hi');
   * // => ['h', 'i']
   */
  function values(object) {
    return object == null ? [] : baseValues(object, keys(object));
  }

  /* Built-in method references for those with the same name as other `lodash` methods. */
  var nativeMax$1 = Math.max;

  /**
   * Checks if `value` is in `collection`. If `collection` is a string, it's
   * checked for a substring of `value`, otherwise
   * [`SameValueZero`](http://ecma-international.org/ecma-262/7.0/#sec-samevaluezero)
   * is used for equality comparisons. If `fromIndex` is negative, it's used as
   * the offset from the end of `collection`.
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object|string} collection The collection to inspect.
   * @param {*} value The value to search for.
   * @param {number} [fromIndex=0] The index to search from.
   * @param- {Object} [guard] Enables use as an iteratee for methods like `_.reduce`.
   * @returns {boolean} Returns `true` if `value` is found, else `false`.
   * @example
   *
   * _.includes([1, 2, 3], 1);
   * // => true
   *
   * _.includes([1, 2, 3], 1, 2);
   * // => false
   *
   * _.includes({ 'a': 1, 'b': 2 }, 1);
   * // => true
   *
   * _.includes('abcd', 'bc');
   * // => true
   */
  function includes(collection, value, fromIndex, guard) {
    collection = isArrayLike(collection) ? collection : values(collection);
    fromIndex = (fromIndex && !guard) ? toInteger(fromIndex) : 0;

    var length = collection.length;
    if (fromIndex < 0) {
      fromIndex = nativeMax$1(length + fromIndex, 0);
    }
    return isString(collection)
      ? (fromIndex <= length && collection.indexOf(value, fromIndex) > -1)
      : (!!length && baseIndexOf(collection, value, fromIndex) > -1);
  }

  /**
   * The base implementation of `_.reduce` and `_.reduceRight`, without support
   * for iteratee shorthands, which iterates over `collection` using `eachFunc`.
   *
   * @private
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} iteratee The function invoked per iteration.
   * @param {*} accumulator The initial value.
   * @param {boolean} initAccum Specify using the first or last element of
   *  `collection` as the initial value.
   * @param {Function} eachFunc The function to iterate over `collection`.
   * @returns {*} Returns the accumulated value.
   */
  function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
    eachFunc(collection, function(value, index, collection) {
      accumulator = initAccum
        ? (initAccum = false, value)
        : iteratee(accumulator, value, index, collection);
    });
    return accumulator;
  }

  /**
   * Reduces `collection` to a value which is the accumulated result of running
   * each element in `collection` thru `iteratee`, where each successive
   * invocation is supplied the return value of the previous. If `accumulator`
   * is not given, the first element of `collection` is used as the initial
   * value. The iteratee is invoked with four arguments:
   * (accumulator, value, index|key, collection).
   *
   * Many lodash methods are guarded to work as iteratees for methods like
   * `_.reduce`, `_.reduceRight`, and `_.transform`.
   *
   * The guarded methods are:
   * `assign`, `defaults`, `defaultsDeep`, `includes`, `merge`, `orderBy`,
   * and `sortBy`
   *
   * @static
   * @memberOf _
   * @since 0.1.0
   * @category Collection
   * @param {Array|Object} collection The collection to iterate over.
   * @param {Function} [iteratee=_.identity] The function invoked per iteration.
   * @param {*} [accumulator] The initial value.
   * @returns {*} Returns the accumulated value.
   * @see _.reduceRight
   * @example
   *
   * _.reduce([1, 2], function(sum, n) {
   *   return sum + n;
   * }, 0);
   * // => 3
   *
   * _.reduce({ 'a': 1, 'b': 2, 'c': 1 }, function(result, value, key) {
   *   (result[value] || (result[value] = [])).push(key);
   *   return result;
   * }, {});
   * // => { '1': ['a', 'c'], '2': ['b'] } (iteration order is not guaranteed)
   */
  function reduce(collection, iteratee, accumulator) {
    var func = isArray(collection) ? arrayReduce : baseReduce,
        initAccum = arguments.length < 3;

    return func(collection, baseIteratee(iteratee), accumulator, initAccum, baseEach);
  }

  var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

  function unwrapExports (x) {
  	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
  }

  function createCommonjsModule(fn, module) {
  	return module = { exports: {} }, fn(module, module.exports), module.exports;
  }

  function select(element) {
      var selectedText;

      if (element.nodeName === 'SELECT') {
          element.focus();

          selectedText = element.value;
      }
      else if (element.nodeName === 'INPUT' || element.nodeName === 'TEXTAREA') {
          var isReadOnly = element.hasAttribute('readonly');

          if (!isReadOnly) {
              element.setAttribute('readonly', '');
          }

          element.select();
          element.setSelectionRange(0, element.value.length);

          if (!isReadOnly) {
              element.removeAttribute('readonly');
          }

          selectedText = element.value;
      }
      else {
          if (element.hasAttribute('contenteditable')) {
              element.focus();
          }

          var selection = window.getSelection();
          var range = document.createRange();

          range.selectNodeContents(element);
          selection.removeAllRanges();
          selection.addRange(range);

          selectedText = selection.toString();
      }

      return selectedText;
  }

  var select_1 = select;

  var clipboardAction = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
      {
          factory(module, select_1);
      }
  })(commonjsGlobal, function (module, _select) {

      var _select2 = _interopRequireDefault(_select);

      function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : {
              default: obj
          };
      }

      var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
          return typeof obj;
      } : function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

      function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
          }
      }

      var _createClass = function () {
          function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) { descriptor.writable = true; }
                  Object.defineProperty(target, descriptor.key, descriptor);
              }
          }

          return function (Constructor, protoProps, staticProps) {
              if (protoProps) { defineProperties(Constructor.prototype, protoProps); }
              if (staticProps) { defineProperties(Constructor, staticProps); }
              return Constructor;
          };
      }();

      var ClipboardAction = function () {
          /**
           * @param {Object} options
           */
          function ClipboardAction(options) {
              _classCallCheck(this, ClipboardAction);

              this.resolveOptions(options);
              this.initSelection();
          }

          /**
           * Defines base properties passed from constructor.
           * @param {Object} options
           */


          _createClass(ClipboardAction, [{
              key: 'resolveOptions',
              value: function resolveOptions() {
                  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                  this.action = options.action;
                  this.container = options.container;
                  this.emitter = options.emitter;
                  this.target = options.target;
                  this.text = options.text;
                  this.trigger = options.trigger;

                  this.selectedText = '';
              }
          }, {
              key: 'initSelection',
              value: function initSelection() {
                  if (this.text) {
                      this.selectFake();
                  } else if (this.target) {
                      this.selectTarget();
                  }
              }
          }, {
              key: 'selectFake',
              value: function selectFake() {
                  var _this = this;

                  var isRTL = document.documentElement.getAttribute('dir') == 'rtl';

                  this.removeFake();

                  this.fakeHandlerCallback = function () {
                      return _this.removeFake();
                  };
                  this.fakeHandler = this.container.addEventListener('click', this.fakeHandlerCallback) || true;

                  this.fakeElem = document.createElement('textarea');
                  // Prevent zooming on iOS
                  this.fakeElem.style.fontSize = '12pt';
                  // Reset box model
                  this.fakeElem.style.border = '0';
                  this.fakeElem.style.padding = '0';
                  this.fakeElem.style.margin = '0';
                  // Move element out of screen horizontally
                  this.fakeElem.style.position = 'absolute';
                  this.fakeElem.style[isRTL ? 'right' : 'left'] = '-9999px';
                  // Move element to the same position vertically
                  var yPosition = window.pageYOffset || document.documentElement.scrollTop;
                  this.fakeElem.style.top = yPosition + 'px';

                  this.fakeElem.setAttribute('readonly', '');
                  this.fakeElem.value = this.text;

                  this.container.appendChild(this.fakeElem);

                  this.selectedText = (0, _select2.default)(this.fakeElem);
                  this.copyText();
              }
          }, {
              key: 'removeFake',
              value: function removeFake() {
                  if (this.fakeHandler) {
                      this.container.removeEventListener('click', this.fakeHandlerCallback);
                      this.fakeHandler = null;
                      this.fakeHandlerCallback = null;
                  }

                  if (this.fakeElem) {
                      this.container.removeChild(this.fakeElem);
                      this.fakeElem = null;
                  }
              }
          }, {
              key: 'selectTarget',
              value: function selectTarget() {
                  this.selectedText = (0, _select2.default)(this.target);
                  this.copyText();
              }
          }, {
              key: 'copyText',
              value: function copyText() {
                  var succeeded = void 0;

                  try {
                      succeeded = document.execCommand(this.action);
                  } catch (err) {
                      succeeded = false;
                  }

                  this.handleResult(succeeded);
              }
          }, {
              key: 'handleResult',
              value: function handleResult(succeeded) {
                  this.emitter.emit(succeeded ? 'success' : 'error', {
                      action: this.action,
                      text: this.selectedText,
                      trigger: this.trigger,
                      clearSelection: this.clearSelection.bind(this)
                  });
              }
          }, {
              key: 'clearSelection',
              value: function clearSelection() {
                  if (this.trigger) {
                      this.trigger.focus();
                  }

                  window.getSelection().removeAllRanges();
              }
          }, {
              key: 'destroy',
              value: function destroy() {
                  this.removeFake();
              }
          }, {
              key: 'action',
              set: function set() {
                  var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'copy';

                  this._action = action;

                  if (this._action !== 'copy' && this._action !== 'cut') {
                      throw new Error('Invalid "action" value, use either "copy" or "cut"');
                  }
              },
              get: function get() {
                  return this._action;
              }
          }, {
              key: 'target',
              set: function set(target) {
                  if (target !== undefined) {
                      if (target && (typeof target === 'undefined' ? 'undefined' : _typeof(target)) === 'object' && target.nodeType === 1) {
                          if (this.action === 'copy' && target.hasAttribute('disabled')) {
                              throw new Error('Invalid "target" attribute. Please use "readonly" instead of "disabled" attribute');
                          }

                          if (this.action === 'cut' && (target.hasAttribute('readonly') || target.hasAttribute('disabled'))) {
                              throw new Error('Invalid "target" attribute. You can\'t cut text from elements with "readonly" or "disabled" attributes');
                          }

                          this._target = target;
                      } else {
                          throw new Error('Invalid "target" value, use a valid Element');
                      }
                  }
              },
              get: function get() {
                  return this._target;
              }
          }]);

          return ClipboardAction;
      }();

      module.exports = ClipboardAction;
  });
  });

  unwrapExports(clipboardAction);

  function E () {
    // Keep this empty so it's easier to inherit from
    // (via https://github.com/lipsmack from https://github.com/scottcorgan/tiny-emitter/issues/3)
  }

  E.prototype = {
    on: function (name, callback, ctx) {
      var e = this.e || (this.e = {});

      (e[name] || (e[name] = [])).push({
        fn: callback,
        ctx: ctx
      });

      return this;
    },

    once: function (name, callback, ctx) {
      var self = this;
      function listener () {
        self.off(name, listener);
        callback.apply(ctx, arguments);
      }
      listener._ = callback;
      return this.on(name, listener, ctx);
    },

    emit: function (name) {
      var data = [].slice.call(arguments, 1);
      var evtArr = ((this.e || (this.e = {}))[name] || []).slice();
      var i = 0;
      var len = evtArr.length;

      for (i; i < len; i++) {
        evtArr[i].fn.apply(evtArr[i].ctx, data);
      }

      return this;
    },

    off: function (name, callback) {
      var e = this.e || (this.e = {});
      var evts = e[name];
      var liveEvents = [];

      if (evts && callback) {
        for (var i = 0, len = evts.length; i < len; i++) {
          if (evts[i].fn !== callback && evts[i].fn._ !== callback)
            { liveEvents.push(evts[i]); }
        }
      }

      // Remove event from queue to prevent memory leak
      // Suggested by https://github.com/lazd
      // Ref: https://github.com/scottcorgan/tiny-emitter/commit/c6ebfaa9bc973b33d110a84a307742b7cf94c953#commitcomment-5024910

      (liveEvents.length)
        ? e[name] = liveEvents
        : delete e[name];

      return this;
    }
  };

  var tinyEmitter = E;
  var TinyEmitter = E;
  tinyEmitter.TinyEmitter = TinyEmitter;

  var is = createCommonjsModule(function (module, exports) {
  /**
   * Check if argument is a HTML element.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.node = function(value) {
      return value !== undefined
          && value instanceof HTMLElement
          && value.nodeType === 1;
  };

  /**
   * Check if argument is a list of HTML elements.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.nodeList = function(value) {
      var type = Object.prototype.toString.call(value);

      return value !== undefined
          && (type === '[object NodeList]' || type === '[object HTMLCollection]')
          && ('length' in value)
          && (value.length === 0 || exports.node(value[0]));
  };

  /**
   * Check if argument is a string.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.string = function(value) {
      return typeof value === 'string'
          || value instanceof String;
  };

  /**
   * Check if argument is a function.
   *
   * @param {Object} value
   * @return {Boolean}
   */
  exports.fn = function(value) {
      var type = Object.prototype.toString.call(value);

      return type === '[object Function]';
  };
  });
  var is_1 = is.node;
  var is_2 = is.nodeList;
  var is_3 = is.string;
  var is_4 = is.fn;

  var DOCUMENT_NODE_TYPE = 9;

  /**
   * A polyfill for Element.matches()
   */
  if (typeof Element !== 'undefined' && !Element.prototype.matches) {
      var proto = Element.prototype;

      proto.matches = proto.matchesSelector ||
                      proto.mozMatchesSelector ||
                      proto.msMatchesSelector ||
                      proto.oMatchesSelector ||
                      proto.webkitMatchesSelector;
  }

  /**
   * Finds the closest parent that matches a selector.
   *
   * @param {Element} element
   * @param {String} selector
   * @return {Function}
   */
  function closest (element, selector) {
      while (element && element.nodeType !== DOCUMENT_NODE_TYPE) {
          if (typeof element.matches === 'function' &&
              element.matches(selector)) {
            return element;
          }
          element = element.parentNode;
      }
  }

  var closest_1 = closest;

  /**
   * Delegates event to a selector.
   *
   * @param {Element} element
   * @param {String} selector
   * @param {String} type
   * @param {Function} callback
   * @param {Boolean} useCapture
   * @return {Object}
   */
  function _delegate(element, selector, type, callback, useCapture) {
      var listenerFn = listener.apply(this, arguments);

      element.addEventListener(type, listenerFn, useCapture);

      return {
          destroy: function() {
              element.removeEventListener(type, listenerFn, useCapture);
          }
      }
  }

  /**
   * Delegates event to a selector.
   *
   * @param {Element|String|Array} [elements]
   * @param {String} selector
   * @param {String} type
   * @param {Function} callback
   * @param {Boolean} useCapture
   * @return {Object}
   */
  function delegate(elements, selector, type, callback, useCapture) {
      // Handle the regular Element usage
      if (typeof elements.addEventListener === 'function') {
          return _delegate.apply(null, arguments);
      }

      // Handle Element-less usage, it defaults to global delegation
      if (typeof type === 'function') {
          // Use `document` as the first parameter, then apply arguments
          // This is a short way to .unshift `arguments` without running into deoptimizations
          return _delegate.bind(null, document).apply(null, arguments);
      }

      // Handle Selector-based usage
      if (typeof elements === 'string') {
          elements = document.querySelectorAll(elements);
      }

      // Handle Array-like based usage
      return Array.prototype.map.call(elements, function (element) {
          return _delegate(element, selector, type, callback, useCapture);
      });
  }

  /**
   * Finds closest match and invokes callback.
   *
   * @param {Element} element
   * @param {String} selector
   * @param {String} type
   * @param {Function} callback
   * @return {Function}
   */
  function listener(element, selector, type, callback) {
      return function(e) {
          e.delegateTarget = closest_1(e.target, selector);

          if (e.delegateTarget) {
              callback.call(element, e);
          }
      }
  }

  var delegate_1 = delegate;

  /**
   * Validates all params and calls the right
   * listener function based on its target type.
   *
   * @param {String|HTMLElement|HTMLCollection|NodeList} target
   * @param {String} type
   * @param {Function} callback
   * @return {Object}
   */
  function listen(target, type, callback) {
      if (!target && !type && !callback) {
          throw new Error('Missing required arguments');
      }

      if (!is.string(type)) {
          throw new TypeError('Second argument must be a String');
      }

      if (!is.fn(callback)) {
          throw new TypeError('Third argument must be a Function');
      }

      if (is.node(target)) {
          return listenNode(target, type, callback);
      }
      else if (is.nodeList(target)) {
          return listenNodeList(target, type, callback);
      }
      else if (is.string(target)) {
          return listenSelector(target, type, callback);
      }
      else {
          throw new TypeError('First argument must be a String, HTMLElement, HTMLCollection, or NodeList');
      }
  }

  /**
   * Adds an event listener to a HTML element
   * and returns a remove listener function.
   *
   * @param {HTMLElement} node
   * @param {String} type
   * @param {Function} callback
   * @return {Object}
   */
  function listenNode(node, type, callback) {
      node.addEventListener(type, callback);

      return {
          destroy: function() {
              node.removeEventListener(type, callback);
          }
      }
  }

  /**
   * Add an event listener to a list of HTML elements
   * and returns a remove listener function.
   *
   * @param {NodeList|HTMLCollection} nodeList
   * @param {String} type
   * @param {Function} callback
   * @return {Object}
   */
  function listenNodeList(nodeList, type, callback) {
      Array.prototype.forEach.call(nodeList, function(node) {
          node.addEventListener(type, callback);
      });

      return {
          destroy: function() {
              Array.prototype.forEach.call(nodeList, function(node) {
                  node.removeEventListener(type, callback);
              });
          }
      }
  }

  /**
   * Add an event listener to a selector
   * and returns a remove listener function.
   *
   * @param {String} selector
   * @param {String} type
   * @param {Function} callback
   * @return {Object}
   */
  function listenSelector(selector, type, callback) {
      return delegate_1(document.body, selector, type, callback);
  }

  var listen_1 = listen;

  var clipboard = createCommonjsModule(function (module, exports) {
  (function (global, factory) {
      {
          factory(module, clipboardAction, tinyEmitter, listen_1);
      }
  })(commonjsGlobal, function (module, _clipboardAction, _tinyEmitter, _goodListener) {

      var _clipboardAction2 = _interopRequireDefault(_clipboardAction);

      var _tinyEmitter2 = _interopRequireDefault(_tinyEmitter);

      var _goodListener2 = _interopRequireDefault(_goodListener);

      function _interopRequireDefault(obj) {
          return obj && obj.__esModule ? obj : {
              default: obj
          };
      }

      var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
          return typeof obj;
      } : function (obj) {
          return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };

      function _classCallCheck(instance, Constructor) {
          if (!(instance instanceof Constructor)) {
              throw new TypeError("Cannot call a class as a function");
          }
      }

      var _createClass = function () {
          function defineProperties(target, props) {
              for (var i = 0; i < props.length; i++) {
                  var descriptor = props[i];
                  descriptor.enumerable = descriptor.enumerable || false;
                  descriptor.configurable = true;
                  if ("value" in descriptor) { descriptor.writable = true; }
                  Object.defineProperty(target, descriptor.key, descriptor);
              }
          }

          return function (Constructor, protoProps, staticProps) {
              if (protoProps) { defineProperties(Constructor.prototype, protoProps); }
              if (staticProps) { defineProperties(Constructor, staticProps); }
              return Constructor;
          };
      }();

      function _possibleConstructorReturn(self, call) {
          if (!self) {
              throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
          }

          return call && (typeof call === "object" || typeof call === "function") ? call : self;
      }

      function _inherits(subClass, superClass) {
          if (typeof superClass !== "function" && superClass !== null) {
              throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
          }

          subClass.prototype = Object.create(superClass && superClass.prototype, {
              constructor: {
                  value: subClass,
                  enumerable: false,
                  writable: true,
                  configurable: true
              }
          });
          if (superClass) { Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }
      }

      var Clipboard = function (_Emitter) {
          _inherits(Clipboard, _Emitter);

          /**
           * @param {String|HTMLElement|HTMLCollection|NodeList} trigger
           * @param {Object} options
           */
          function Clipboard(trigger, options) {
              _classCallCheck(this, Clipboard);

              var _this = _possibleConstructorReturn(this, (Clipboard.__proto__ || Object.getPrototypeOf(Clipboard)).call(this));

              _this.resolveOptions(options);
              _this.listenClick(trigger);
              return _this;
          }

          /**
           * Defines if attributes would be resolved using internal setter functions
           * or custom functions that were passed in the constructor.
           * @param {Object} options
           */


          _createClass(Clipboard, [{
              key: 'resolveOptions',
              value: function resolveOptions() {
                  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

                  this.action = typeof options.action === 'function' ? options.action : this.defaultAction;
                  this.target = typeof options.target === 'function' ? options.target : this.defaultTarget;
                  this.text = typeof options.text === 'function' ? options.text : this.defaultText;
                  this.container = _typeof(options.container) === 'object' ? options.container : document.body;
              }
          }, {
              key: 'listenClick',
              value: function listenClick(trigger) {
                  var _this2 = this;

                  this.listener = (0, _goodListener2.default)(trigger, 'click', function (e) {
                      return _this2.onClick(e);
                  });
              }
          }, {
              key: 'onClick',
              value: function onClick(e) {
                  var trigger = e.delegateTarget || e.currentTarget;

                  if (this.clipboardAction) {
                      this.clipboardAction = null;
                  }

                  this.clipboardAction = new _clipboardAction2.default({
                      action: this.action(trigger),
                      target: this.target(trigger),
                      text: this.text(trigger),
                      container: this.container,
                      trigger: trigger,
                      emitter: this
                  });
              }
          }, {
              key: 'defaultAction',
              value: function defaultAction(trigger) {
                  return getAttributeValue('action', trigger);
              }
          }, {
              key: 'defaultTarget',
              value: function defaultTarget(trigger) {
                  var selector = getAttributeValue('target', trigger);

                  if (selector) {
                      return document.querySelector(selector);
                  }
              }
          }, {
              key: 'defaultText',
              value: function defaultText(trigger) {
                  return getAttributeValue('text', trigger);
              }
          }, {
              key: 'destroy',
              value: function destroy() {
                  this.listener.destroy();

                  if (this.clipboardAction) {
                      this.clipboardAction.destroy();
                      this.clipboardAction = null;
                  }
              }
          }], [{
              key: 'isSupported',
              value: function isSupported() {
                  var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : ['copy', 'cut'];

                  var actions = typeof action === 'string' ? [action] : action;
                  var support = !!document.queryCommandSupported;

                  actions.forEach(function (action) {
                      support = support && !!document.queryCommandSupported(action);
                  });

                  return support;
              }
          }]);

          return Clipboard;
      }(_tinyEmitter2.default);

      /**
       * Helper function to retrieve attribute value.
       * @param {String} suffix
       * @param {Element} element
       */
      function getAttributeValue(suffix, element) {
          var attribute = 'data-clipboard-' + suffix;

          if (!element.hasAttribute(attribute)) {
              return;
          }

          return element.getAttribute(attribute);
      }

      module.exports = Clipboard;
  });
  });

  var Clipboard = unwrapExports(clipboard);

  // Define a new function from fn1 and fn2 equivalent to fn2(fn1)
  //
  // An optional thisArg is provided in case the new function is being defined on
  // an object and needs to be able to reference its properties with `this`:
  // without providing it, `this` will refer to the global object.
  function compose(fn1, fn2, thisArg) {
    thisArg = thisArg || this;

    return function() { return fn2.call(thisArg, fn1.apply(thisArg, arguments)) }
  }

  function captureGroup(pattern, string, num) {
    if ( num === void 0 ) num=1;

    var matchData = string.match(pattern);

    return matchData && matchData[num]
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

  function escapeRegExp(string){
    if (typeof string !== "string") { throw (string + " not a string") }
    return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  }

  function extend (consumer) {
    var providers = [], len = arguments.length - 1;
    while ( len-- > 0 ) providers[ len ] = arguments[ len + 1 ];

    var key;
    var i;
    var provider;

    for (i = 0; i < providers.length; ++i) {
      provider = providers[i];

      for (key in provider) {
        if (provider.hasOwnProperty(key)) {
          consumer[key] = provider[key];
        }
      }
    }

    return consumer
  }

  function andCombiner(acc, pattern) {
    var next;
    if ( pattern instanceof RegExp ) { next = pattern.source; }
    if ( typeof pattern === "string" ) { next = escapeRegExp(pattern); }
    if (! next ) { throw (pattern + " not a String or a RegExp") }

    // Slightly hacky special case for first iteration
    if ( acc instanceof NullPattern ) { return RegExp(("(?:" + next + ")")) }

    var patternSoFar;
    if ( acc instanceof RegExp ) { patternSoFar = acc.source; }
    if ( patternSoFar == null ) { throw (acc + " not a String or a RegExp") }

    return RegExp((patternSoFar + "(?:" + next + ")"))
  }

  // If you're curious, there's a long comment explaining this towards the bottom
  // of js/utils/matchAnyOf.js
  function NullPattern(){}

  // Takes any number of strings or regexes as arguments
  // Returns a new regex pattern which matches any of its arguments
  //
  // Note: because of the way the regular expressions get combined, flags are
  // discarded. The main annoyance this causes is with case-sensitivity: because
  // it's impossible to give flags to only one sub-pattern, case-insensitive
  // matches have to be specified for each individual letter, as:
  //    /[Cc]ase [Ii]nsensitive/
  // or worse,
  //    /[Hh][Tt][Mm][Ll]/
  function matchAllOf() {
    var list = [], len = arguments.length;
    while ( len-- ) list[ len ] = arguments[ len ];

    return reduce(list, andCombiner, new NullPattern())
  }

  function orCombiner(acc, pattern) {
    var next;
    if ( pattern instanceof RegExp ) { next = pattern.source; }
    if ( typeof pattern === "string" ) { next = escapeRegExp(pattern); }
    if (! next ) { throw (pattern + " not a String or a RegExp") }

    // Slightly hacky special case for first iteration. See below.
    if ( acc instanceof NullPattern$1 ) { return RegExp(next) }

    var patternSoFar;
    if ( acc instanceof RegExp ) { patternSoFar = acc.source; }
    if ( patternSoFar == null ) { throw (acc + " not a String or a RegExp") }

    return RegExp((patternSoFar + "|" + next))
  }

  // So it happens that, if a custom accumulator isn't specified, single-element
  // instances of `list` seem to short-circuit the coercian into RegExp.
  //
  // This isn't always wrong: given a regex, it returns a regex (100%
  // correct); but given a string, it returns a string.  Now
  // String.prototype.match("some string") attempts to match the string
  // literally, which is the desired behavior. But given the explicit contract to
  // return a regex, the string option feels hacky, and would be a very annoying
  // bug to track down were code to change around it in a way that raised errors
  // given a string.
  //
  // The obvious first option, a "blank" regex a la `RegExp()` doesn't work: sans
  // argument, the RegExp constructor returns an empty non-capture group, like
  // `/(?:)/`. And then everything is ruined, since a pattern starting with
  // `/(?:)|/` will match literally every string.
  //
  // So NullPattern is just a semantic name to feed `instanceof` to provide an
  // escape hatch for an edge case.
  function NullPattern$1(){}

  // Takes any number of strings or regexes as arguments
  // Returns a new regex pattern which matches any of its arguments
  //
  // Note: because of the way the regular expressions get combined, flags are
  // discarded. The main annoyance this causes is with case-sensitivity: because
  // it's impossible to give flags to only one sub-pattern, case-insensitive
  // matches have to be specified for each individual letter, as:
  //    /[Cc]ase [Ii]nsensitive/
  // or worse,
  //    /[Hh][Tt][Mm][Ll]/
  function matchAnyOf() {
    var list = [], len = arguments.length;
    while ( len-- ) list[ len ] = arguments[ len ];

    return reduce(list, orCombiner, new NullPattern$1())
  }

  // Even though lodash's version of each is nicer (by passing the index as the
  // first argument to the iteratee function, jQuery rather undermines the whole
  // "don't require the coder to think about how you're iterating" thing), using
  // the jQuery version means the creator page bundle doesn't need to load any of
  // lodash, which makes a much smaller bundle for users to download
  var each = $.each;

  function requiredFields(obj) {
    var fields = [], len = arguments.length - 1;
    while ( len-- > 0 ) fields[ len ] = arguments[ len + 1 ];

    each(fields, function (_idx, f) {
      if ( !(f in obj) ) { throw ("Required field " + f + " not in " + (Object.keys(obj))) }
    });
    return true
  }

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
  var detectType = curry(function detectType(citationConstructor, taxonomy, citationText) {
    var len = taxonomy.length;
    var i;

    for ( i = 0; i < len; ++i ) {
      if ( citationText.match(taxonomy[i].idPattern) ) {
        return new citationConstructor(citationText, taxonomy[i])
      }
    }
  });

  var urlEncode = window.encodeURIComponent;

  // meant to be invoked as a method of with a manually-provided this object, e.g.
  // `genericUrl.call(source, cite)`
  function genericUrl(cite) {
    var properCitation = urlEncode(
      this.canDeepLink(cite.type)
      ? cite.fullCite
      : cite.mainCite
    );

    return this.baseUrl + properCitation
  }

  var urlEncode$1 = compose(window.encodeURIComponent, function (encodedURIComponent) {
    return encodedURIComponent.replace(/%20/g, '_')
  });

  var urlDecode = compose(window.decodeURIComponent, function (decodedURIComponent) {
    return decodedURIComponent.replace(/_/g, ' ')
  });

  var federalCaseReporters = [ /[Ff]\. ?(?:[123]d\.?)?/
                 , /[Ff]\. ?[Ss]upp\. ?(?:[123]d\.?)?/
                 , /[Ss]\. ?[Cc]t\.?/
                 ];

  var urlEncode$2    = window.encodeURIComponent;

  var sources = [
    { name: "Westlaw"//{{{
    , baseUrl: "http://a.next.westlaw.com/Link/Document/FullText?findType=Y&cite="
    , $anchor: $("#link--westlaw__a")
    , _deepLinkableTypes: []
    , _cannot: [ "docket_number" ]
    , _typeSpecificUrls: {//{{{
        _federalRule: function(cite, typeName) {//{{{
          return ("" + (this.baseUrl) + typeName + (cite.ruleNumberAndJumpCite))
        }//}}}
      , frap: function(cite) {//{{{
          return this._federalRule(cite, "frap%20")
        }//}}}
      , frcp: function(cite) {//{{{
          return this._federalRule(cite, "frcp%20")
        }//}}}
      , frcrmp: function(cite) {//{{{
          return this._federalRule(cite, "frcrp%20")
        }//}}}
      , frbp: function(cite) {//{{{
          return this._federalRule(cite, "frbp%20")
        }//}}}
      , fre: function(cite) {//{{{
          return this._federalRule(cite, "fre%20")
        }//}}}
      }//}}}
    }//}}}
  , { name: "Lexis"//{{{
    , baseUrl: "http://advance.lexis.com/laapi/search?q="
    , $anchor: $("#link--lexis__a")
    , _deepLinkableTypes: ["*"]
    , _cannot: [ "public_law" ]
    , _typeSpecificUrls: {//{{{
        _federalRule: function(cite, typeName) {//{{{
          return ("" + (this.baseUrl) + typeName + (cite.ruleNumberAndJumpCite))
        }//}}}
      , frap: function(cite) {//{{{
          return this._federalRule(cite, "frap%20")
        }//}}}
      , frcp: function(cite) {//{{{
          return this._federalRule(cite, "frcp%20")
        }//}}}
      , frcrmp: function(cite) {//{{{
          return this._federalRule(cite, "frcrp%20")
        }//}}}
      , frbp: function(cite) {//{{{
          return this._federalRule(cite, "frbp%20")
        }//}}}
      , fre: function(cite) {//{{{
          return this._federalRule(cite, "fre%20")
        }//}}}
      , docket_number: function(cite) {//{{{
          return ((this.baseUrl) + "\"" + (urlEncode$2(cite.mainCite)) + "\"")
        }//}}}
      , default: function(cite) {//{{{
          // Chaining `replace` calls isn't logically beautiful, but reads more
          // clearly than constructing a regex for an optional url-encoded space.
          var cleanedCitation = cite.fullCite.replace("¶ ", "")
                                               .replace("¶", "");

          return ("" + (this.baseUrl) + (urlEncode$2(cleanedCitation)))
        }//}}}
      }//}}}
    }//}}}
  , { name: "Casetext"//{{{
    , baseUrl: "https://casetext.com/search?q="
    , $anchor: $("#link--casetext__a")
    , _deepLinkableTypes: []
    , _cannot: allBut( "scotus_us_reports"
                     , "federal_case"
                     , "docket_number"
                     , "default"
                     )
    , _typeSpecificUrls: {//{{{
        docket_number: function(cite) { return ((this.baseUrl) + "\"" + (urlEncode$2(cite.fullCite)) + "\"") }
      }//}}}
    }//}}}
  , { name: "CourtListener"//{{{
    , baseUrl: "https://www.courtlistener.com/"
    , $anchor: $("#link--courtlistener__a")
    , _deepLinkableTypes: []
    , _cannot: allBut("us_constitution"
                     , "scotus_us_reports"
                     , "federal_case"
                     , "docket_number"
                     , "default"
                     )
    , _url: function(cite) { return ((this.baseUrl) + "?citation=" + (urlEncode$2(cite.mainCite))) }
    , _typeSpecificUrls: {//{{{
        docket_number: function(cite) { return ((this.baseUrl) + "?docket_number=" + (urlEncode$2(cite.rawNumber))) }
      }//}}}
    }//}}}
  , { name: "Ravel"//{{{
    , baseUrl: "http://www.ravellaw.com/search?query="
    , $anchor: $("#link--ravel__a")
    , _deepLinkableTypes: [
        "usc"
      , "frap"
      , "frcp"
      , "frcrmp"
      , "frbp"
      , "fre"
      ]
    , _cannot: [ "uniform_commercial_code"
               , "wl_database"
               , "cfr"
               , "public_law"
               , "statutes_at_large"
               , "federal_register"
               , "scotus_us_reports"
               , "law_journal"
               ]
    , _typeSpecificUrls: {
      usc: function(cite) {//{{{
        return ("https://www.ravellaw.com/statutes/us:usc:t" + (cite.title) + "/us:usc:t" + (cite.title) + ":s" + (cite.section) + "?query=" + (urlEncode$2(cite.fullCite)))
      }//}}}
      , docket_number: function(cite) {//{{{
          return ((this.baseUrl) + "\"" + (urlEncode$2(cite.mainCite)) + "\"")
        }//}}}
    }
    }//}}}
  , { name: "LII"//{{{
    , baseUrl: "https://www.law.cornell.edu"
    , $anchor: $("#link--lii__a")
    , _deepLinkableTypes: ["*"]
    , _cannot: allBut( "us_constitution"
                     , "cfr"
                     , "usc"
                     , "uniform_commercial_code"
                     , "frap"
                     , "frcrmp"
                     , "frcp"
                     , "fre"
                     , "frbp"
                     , "scotus_us_reports"
                     )
      // Before they are used, Source objects may be extended with one or more methods
      // corresponding to a citation type name. These methods MUST take, as a
      // single argument, the url-encoded citation.
    , _typeSpecificUrls: {//{{{
        _federalRule: function(typeName, cite) {//{{{
          var text = cite.fullCite;
          var jumpCiteMatch;
          var jumpCite;

          // Properly format jump cite, if present
          if ( jumpCiteMatch = text.match(/(\(.\))/g) ) {
            jumpCite = jumpCiteMatch.join("_").replace(/[\(\)]/g, "");
          }

          return ((this.baseUrl) + "/rules/" + typeName + "/rule_" + (cite.ruleNumber) + "#rule_" + (cite.ruleNumber) + "_" + jumpCite)
        }//}}}
      , us_constitution: function(cite) {//{{{
          var article = "";
          var section = "";

          if ( cite.article ) { article = "/article" + (cite.article); }
          if ( cite.section ) { section = "#section" + (cite.section); }

          return ((this.baseUrl) + "/constitution" + article + section)
        }//}}}
      , cfr: function(cite) {//{{{
          var jumpCiteMatch;
          var jumpCite = "";

          if ( jumpCiteMatch = cite.jumpCite.match(/(\([^)]{1,4}\))/g) ) {
            jumpCite = "#" + (jumpCiteMatch.join("_").replace(/[\(\)]/g, ""));
          }

          return ((this.baseUrl) + "/cfr/text/" + (cite.title) + "/" + (cite.section) + jumpCite)
        }//}}}
      , usc: function(cite) {//{{{
          var jumpCiteMatch;
          var jumpCite = "";

          if ( jumpCiteMatch = cite.jumpCite.match(/(\([^)]{1,4}\))/g) ) {
            jumpCite = "#" + (jumpCiteMatch.join("_").replace(/[\(\)]/g, ""));
          }

          return ((this.baseUrl) + "/uscode/text/" + (cite.title) + "/" + (cite.section) + jumpCite)
        }//}}}
      , uniform_commercial_code: function(cite) {//{{{
        return ((this.baseUrl) + "/ucc/" + (cite.article) + "/" + (cite.article) + "-" + (cite.section))
      }//}}}
      , frap:   function(cite) {//{{{
          return this._federalRule("frap", cite)
        }//}}}
      , frcrmp: function(cite) {//{{{
          return this._federalRule("frcrmp", cite)
        }//}}}
      , frcp:   function(cite) {//{{{
          return this._federalRule("frcp", cite)
        }//}}}
      , fre:    function(cite) {//{{{
          return this._federalRule("fre", cite)
        }//}}}
      , frbp:   function(cite) {//{{{
          return this._federalRule("frbp", cite)
        }//}}}
      , scotus_us_reports: function(cite) {//{{{
          return ((this.baseUrl) + "/supremecourt/text/" + (cite.volume) + "/" + (cite.page))
        }//}}}
      }//}}}
    }//}}}
  , { name: "Google Scholar"//{{{
    , baseUrl: "https://scholar.google.com/scholar?as_sdt=2006&hl=en&q="
    , $anchor: $("#link--google-scholar__a")
    , _deepLinkableTypes: [
        "cfr"
      , "usc"
      , "frap"
      , "frcp"
      , "frcrmp"
      , "frbp"
      , "fre"
      ]
    , _cannot: [ "uniform_commercial_code"
               , "public_law"
               , "statutes_at_large"
               , "federal_register"
               , "law_journal"
               , "wl_database"
               ]
    , _url: function(cite) {
        if ( this.canDeepLink(cite.type) ) {
          return ((this.baseUrl) + "\"" + (urlEncode$2(cite.fullCite)) + "\"")
        } else {
          return ((this.baseUrl) + "\"" + (urlEncode$2(cite.mainCite)) + "\"")
        }
      }
    }//}}}
  , { name: "Google Search"//{{{
    , baseUrl: "https://google.com/search?q="
    , $anchor: $("#link--google__a")
    , _deepLinkableTypes: ["*"]
    , _cannot: [ "wl_database" ]
    , _typeSpecificUrls: {//{{{
        docket_number: function(cite) {//{{{
          return ((this.baseUrl) + "\"" + (urlEncode$2(cite.mainCite)) + "\"")
        }//}}}
      }//}}}
    }//}}}
  , { name: "Justia"//{{{
    , baseUrl: "https://www.justia.com/search?cx=004471346504245195276%3Ajieqepl7s5a&sa=Search+Justia&q="
    , $anchor: $("#link--justia__a")
    , _deepLinkableTypes: []
    , _cannot: [ "federal_register"
               , "public_law"
               , "statutes_at_large"
               , "usc"
               , "law_journal"
               , "wl_database"
               ]
    , _typeSpecificUrls: {//{{{
        cfr: function(cite) {//{{{
          return ("http://law.justia.com/cfr/title" + (cite.title) + "/" + (cite.title) + "cfr" + (cite.part) + "_main_02.html")
        }//}}}
      , scotus_us_reports: function(cite) {//{{{
          return ("https://supreme.justia.com/cases/federal/us/" + (cite.volume) + "/" + (cite.page) + "/")
        }//}}}
      , docket_number: function(cite) {//{{{
          return ((this.baseUrl) + "\"" + (urlEncode$2(cite.mainCite)) + "\"")
        }//}}}
      }//}}}
    }//}}}
  , { name: "Fastcase"//{{{
    , baseUrl: "https://permafrast.herokuapp.com/"
    , $anchor: $("#link--fastcase__a")
    , _deepLinkableTypes: ["*"]
    , _cannot: allBut()
    , _typeSpecificUrls: {//{{{
        federal_case: function(cite) {//{{{
          return ("" + (this.baseUrl) + (cite.volume) + "/" + (cleanReporter(cite.reporter)) + "/" + (cite.page) + "/redirect")

          // Permafrast and/or Fastcase freaks out when the reporter name
          // contains a space (e.g. "f. 3d" will cause a server error while
          // "f.3d" will not)
          function cleanReporter(reporterVolume) {
            return reporterVolume.replace(/ /g, "")
          }
        }//}}}
      }//}}}
    }//}}}
  , { name: "Federal Digital System"//{{{
    , baseUrl: "http://api.fdsys.gov/link"
    , $anchor: $("#link--fdsys__a")
    , _deepLinkableTypes: []
    , _cannot: allBut("federal_register"
                     , "public_law"
                     , "statutes_at_large"
                     )
    , _typeSpecificUrls: {//{{{
        federal_register: function(cite) {//{{{
          return this.baseUrl + "?collection=fr&volume=" + (cite.volume) + "&page=" + (cite.page)
        }//}}}
      , public_law: function(cite) {//{{{
          return ((this.baseUrl) + "?collection=plaw&lawtype=public&congress=" + (cite.congress) + "&lawnum=" + (cite.law))
        }//}}}
      , statutes_at_large: function(cite) {//{{{
          return this.baseUrl + "?collection=statute&volume=" + (cite.volume) + "&page=" + (cite.page)
        }//}}}
      }//}}}
    }//}}}
  , { name: "HeinOnline"//{{{
    , baseUrl: "http://www.heinonline.org/HOL/OneBoxCitation?&collection=journals&base=js&cit_string="
    , $anchor: $("#link--hein-online__a")
    , _deepLinkableTypes: []
    , _cannot: allBut("law_journal")
    }//}}}
  ];

  function allBut() {
    var exceptions = [], len = arguments.length;
    while ( len-- ) exceptions[ len ] = arguments[ len ];
  //{{{
    var allCitationTypes = [ "us_constitution"
                             , "cfr"
                             , "usc"
                             , "uniform_commercial_code"
                             , "wl_database"
                             , "public_law"
                             , "statutes_at_large"
                             , "federal_register"
                             , "frap"
                             , "frcrmp"
                             , "frcp"
                             , "fre"
                             , "frbp"
                             , "scotus_us_reports"
                             , "federal_case"
                             , "state_constitution"
                             , "law_journal"
                             , "law_statute_code_rule"
                             , "docket_number"
                             , "default"
                             ];

    return difference(allCitationTypes, exceptions)
  }//}}}

  // vim:foldmethod=marker:foldlevel=0

  var stateAbbreviations = [ 'Ala.'
                 , 'Alaska'
                 , 'Ariz.'
                 , 'Ark.'
                 , 'Cal.'
                 , 'Colo.'
                 , 'Conn.'
                 , 'Del.'
                 , 'Fla.'
                 , 'Ga.'
                 , 'Haw.'
                 , 'Idaho'
                 , 'Ill.'
                 , 'Ind.'
                 , 'Iowa'
                 , 'Kan.'
                 , 'Ky.'
                 , 'La.'
                 , 'Me.'
                 , 'Md.'
                 , 'Mass.'
                 , 'Mich.'
                 , 'Minn.'
                 , 'Miss.'
                 , 'Mo.'
                 , 'Mont.'
                 , 'Neb.'
                 , 'Nev.'
                 , 'N.H.'
                 , 'N.J.'
                 , 'N.M.'
                 , 'N.Y.'
                 , 'N.C.'
                 , 'N.D.'
                 , 'Ohio'
                 , 'Okla.'
                 , 'Or.'
                 , 'Pa.'
                 , 'R.I.'
                 , 'S.C.'
                 , 'S.D.'
                 , 'Tenn.'
                 , 'Tex.'
                 , 'Utah'
                 , 'Vt.'
                 , 'Va.'
                 , 'Wash.'
                 , 'W. Va.'
                 , 'Wis.'
                 , 'Wyo.'
                 ];

  // TODO use normal fn call syntax, as `const anyStateAbbreviation = matchAnyOf(stateAbbreviations)`
  var anyStateAbbreviation   = matchAnyOf.apply(null, stateAbbreviations);
  var anyFederalCaseReporter = matchAnyOf.apply(null, federalCaseReporters);
  var fedRuleNumberWithJump  = curry(federalRuleNumber)(true);
  var fedRuleNumber          = curry(federalRuleNumber)(false);

  var citationTypes = [
    { typeId:          "us_constitution"//{{{
    , idPattern:       /U\.?S\.? Const/i
    , mainCitePattern: /(.+), cl\./
    , _subparts:       { article: function (c) { return captureGroup(/art(?:\.?|icle) ?([0-9ivxlc]+)/i, c); }
                       , section: function (c) { return captureGroup(/(?:sect(?:\.|ion)?|\u00a7) ?([0-9ivxlc]+)/i, c); }
                       }
    }//}}}
  , { typeId:          "cfr"//{{{
    , idPattern:       /(?:C\.? ?F\.? ?R\.?)/i
    , mainCitePattern: /([^\(]+)(?:\s*\([^)]{1,4}\))+/
    , _subparts: { title:   function (c) { return head(c.match(/\d+/)); }
                 , section: function (c) { return captureGroup(/\d+\D+(?:sect(?:\.|ion)?|\u00a7)? ?([0-9\.]+)/i, c); }
                 , part:    function (c) { return captureGroup(/(\d+)\.\d+/, c); }
                 }
    }//}}}
  , { typeId:          "usc"//{{{
    , idPattern:       /(?:u\.? ?s\.? ?c\.?)/i
    , mainCitePattern: /([^\(]+)(?:\s*\([^)]{1,4}\))+/
    , _subparts: { title:   function (c) { return head(c.match(/\d+/)); }
                 , section: function (c) { return captureGroup(/\d+\D+(?:sect(?:\.|ion)?|\u00a7)? ?([\w\-\.]+)/i, c); }
                 }
    }//}}}
  , { typeId:          "uniform_commercial_code"//{{{
    , idPattern:       /u\.? ?c\.? ?c\.? /i
    , mainCitePattern: /(.*)/
    , _subparts:       { article: function (c) { return captureGroup(/(\d)-\d+/, c); }
                       , section: function (c) { return captureGroup(/\d-(\d+)/, c); }
                       }
    }//}}}
  , { typeId:          "wl_database"//{{{
    , idPattern:       /(?:\d+ WL \d+)/i
    , mainCitePattern: /(\d+ WL \d+)(?:, \d+)+/
    }//}}}
  , { typeId:          "public_law"//{{{
    , idPattern:       /pub[. ]{0,2}l/i
    , mainCitePattern: /(.*)/
    , _subparts:       { congress: function (c) { return captureGroup(/(\d*)-\d*/, c); }
                       , law:      function (c) { return captureGroup(/\d*-(\d*)/, c); }
                       }
    }//}}}
  , { typeId:          "statutes_at_large"//{{{
    , idPattern:       /\d+ stat\.? \d+/i
    , mainCitePattern: /(.*)/
    , _subparts:       { volume: function (c) { return head(c.match(/^\d+/)); }
                       , page:   function (c) { return captureGroup(/stat\.? (\d+)/i, c); }
                       }
    }//}}}
  , { typeId:          "federal_register"//{{{
    , idPattern:       /(?:(?:federal|fed\.) ?(register|reg\.)|(?:f\.r\.)|(?: fr ))/i
    , mainCitePattern: /(.+\d{1,5})(?:, [\d,]{1,6})/
    , _subparts:       { volume: function (c) { return head(c.match(/^\d+/)); }
                       , page:   function (c) { return head(c.match(/[\d,]+$/)).replace(",", ""); }
                       }
    }//}}}
  , { typeId:          "frap"//{{{
    , idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:appellate|app|a)/i
    , mainCitePattern: /([^(]+)(?:s*(.))+/
    , _subparts:       { ruleNumber:            fedRuleNumber
                       , ruleNumberAndJumpCite: fedRuleNumberWithJump
                       }
    }//}}}
  , { typeId:          "frcrmp"//{{{
    , idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:criminal|crim|cr)/i
    , mainCitePattern: /([^(]+)(?:s*(.))+/
    , _subparts:       { ruleNumber:            fedRuleNumber
                       , ruleNumberAndJumpCite: fedRuleNumberWithJump
                       }
    }//}}}
  , { typeId:          "frcp"//{{{
    , idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:civil|civ|c)/i
    , mainCitePattern: /([^(]+)(?:s*(.))+/
    , _subparts:       { ruleNumber:            fedRuleNumber
                       , ruleNumberAndJumpCite: fedRuleNumberWithJump
                       }
    }//}}}
  , { typeId:          "fre"//{{{
    , idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:evidence|evid|e)/i
    , mainCitePattern: /([^(]+)(?:s*(.))+/
    , _subparts:       { ruleNumber:            fedRuleNumber
                       , ruleNumberAndJumpCite: fedRuleNumberWithJump
                       }
    }//}}}
  , { typeId:          "frbp"//{{{
    , idPattern:       /(?:(?:federal|fed|f)\.? ?(?:rules?|r)\.? ?)(?:of )?(?:bankruptcy|bankr|bkrtcy|b)/i
    , mainCitePattern: /([^(]+)(?:s*(.))+/
    , _subparts:       { ruleNumber:            fedRuleNumber
                       , ruleNumberAndJumpCite: fedRuleNumberWithJump
                       }
    }//}}}
  , { typeId:          "scotus_us_reports"//{{{
    , idPattern:       /\d{1,5} (?:u\.? ?s\.?) \d{1,5}/i
    , // some supreme court case citations have, e.g. '(2006)'
      mainCitePattern: /(.+\d{1,5})(?:, [\d,]{1,6})/
    , _subparts:       { volume: function (c) { return captureGroup(/(\d+)/, c); }
                       , page:   function (c) { return captureGroup(/\d+\s+(?:U\.? ?S\.?)\s+([0-9]+)/i, c); }
                       }
    }//}}}
  , { typeId:          "federal_case"//{{{
    , idPattern:       matchAllOf(/\d{1,5} /, anyFederalCaseReporter, / \d{1,5}/)
      // some federal case citations have, e.g. '(2006)' following jump cite
      // (if present): anything to do about it?
    , mainCitePattern: /(.+\d{1,5})(?:, [\d,]{1,6})/
    , _subparts: { volume:   function (c) { return head(c.match(/^\d+/)); }
                 , reporter: function (c) { return head(c.match(anyFederalCaseReporter)); }
                 , page:     function (c) { return captureGroup(matchAllOf(anyFederalCaseReporter, / (\d{1,5})/), c); }
                 }
    }//}}}
  , { typeId:          "state_constitution"//{{{
    , idPattern:       matchAllOf(anyStateAbbreviation, / [Cc]onst/)
    , mainCitePattern: /(.*(?:section|\u00a7) ?[\d\.]+).+/i
    }//}}}
  , { typeId:          "law_journal"//{{{
    , idPattern:       matchAnyOf( /L\. ?J\./
                                    , /L\. ?Rev\./
                                    , /J\.[\w&'.\s]+L\./
                                    , "J.L. & Econ."
                                    , "J. Emp. Legal Stud."
                                    , "J. Legal Stud."
                                    , "L. & Contemp. Probs."
                                    , "Sup. Ct. Rev."
                                    )
    // TODO: do these citations ever have jump cites?
    , mainCitePattern: /(.*)/i
    }//}}}
  , { typeId:          "law_statute_code_rule"//{{{
    , idPattern:       /(?:laws?)|(?:stat\.?)|(?:code)|(?:regs\.?)|(?:rule)/i
    , mainCitePattern: /([^\(]+)(?:\s*\([^)]{1,4}\))+/
    }//}}}
  , { typeId:          "docket_number"//{{{
    , idPattern:       /^No\. \d+/i
    , mainCitePattern: /(.+)/
    , _subparts:       { rawNumber: function (c) { return c.slice(4); } }
    }//}}}
  , { typeId:          "default"//{{{
    , idPattern:       /.*/
    , mainCitePattern: /(?:(.+\d+)(?:, (?:\u00b6 ?)?\d+))|(?:([^\(]+)(?:\s*\([^)]{1,4}\))+)/
    }//}}}
  ];

  function federalRuleNumber(withJumpCite, citeText) {
    var matcher = ( withJumpCite
                    ? /\d+\.?\d* ?(?:\([^)]{1,4}\) ?)*/
                    : /\d+(?:\.\d+)?/
                    );
    var ruleNumberMatch;

    if ( (ruleNumberMatch = citeText.match(matcher)) ) { return head(ruleNumberMatch) }
  }

  // vim:foldmethod=marker:foldmarker={{{,}}}:foldlevel=0:foldopen=:foldclose=

  var extend$1 = $.extend;
  var trim = $.trim;

  function Citation(citationText, config) {
    if ( !(this instanceof Citation)) { return new Citation(citationText, config) }

    requiredFields(config, "typeId", "idPattern", "mainCitePattern");
    if ( !citationText.match(config.idPattern) ) {
      throw new Error(("\"" + citationText + "\" doesn't match " + (config.typeId) + " type."))
    }

    var mainCite = buildMainCite(citationText, config.mainCitePattern);
    var jumpCite = buildJumpCite(citationText, mainCite);

    var subparty = config._subparts || {};
    var subparts = buildSubparts({}, subparty, citationText);

    extend$1(this, subparts, {
      type:     config.typeId
    , mainCite: trim(mainCite)
    , jumpCite: jumpCite
    , fullCite: citationText
    });
  }

  Citation.from = detectType(Citation, citationTypes);

  // mainCitePatterns match against the jump cite of the given type, with
  // everything preceding the jump cite put in a capture group. If the citation
  // has a jump cite, the content of the capture group (i.e. everything BUT the
  // jump cite) is returned; if not, the entire citation text is returned.
  function buildMainCite (citationText, mainCitePattern) {
    var matchData = citationText.match(mainCitePattern);

    // the default type checks against two jump cite patterns; it will have one
    // string and one undefined for matchData[1] & matchData[2], in arbitrary
    // order. Thus the need for `compact`.
    return ( !!matchData )
           ? ( compact(matchData)[1] )
           : citationText
  }

  function buildJumpCite (citationText, mainCiteText) {
    return ( citationText === mainCiteText )
           ? ""
           : citationText.slice(mainCiteText.length)
  }

  // self is extended from properties of subparty
  //  for each property:
  //    self.key is same name as config._subparts.key
  //    self.key has same value as config._subparts.key(citationText)
  function buildSubparts (self, subparty, citationText) {
    for ( var propertyName in subparty ) {
      (function (propertyName) {
        self[propertyName] = subparty[propertyName].call(self, citationText);
      })(propertyName);
    }

    return self
  }

  function Source(config) {
    if (! (this instanceof Source)) { return new Source(config) }

    requiredFields(config, "name", "baseUrl", "_deepLinkableTypes", "$anchor", "_cannot");
    extend(this, {
        name:               config.name
      , baseUrl:            config.baseUrl
      , _deepLinkableTypes: config._deepLinkableTypes
      , $anchor:            config.$anchor
      , _cannot:            config._cannot
      , _url:               config._url
      // By convention, _typeSpecificUrls is an object, each of whose methods
      // is stored under a key that shares its name with a type.
      //    ex. {usc: function (cite) { ... }, federal_case: function(cite) { ... } }
      // If a source is extended with such a method, it uses it to handle that
      // type over the function defined at `Source.prototype.url { urlGetter }`.
      }
    , config._typeSpecificUrls || {}
    );
  }

  extend(Source.prototype, {
    url: function url(citation) {
      var urlGetter = this[citation.type] || this._url || genericUrl;

      return urlGetter.call(this, citation)
    }
  , canHandle: function canHandle(type) {
      return ( includes(this._cannot, type) )
             ? false
             : true
    }
  , canDeepLink: function canDeepLink(type) {
      return ( includes(this._deepLinkableTypes, type) || includes(this._deepLinkableTypes, "*") )
    }
  });

  var ONE_DAY             = 86400000; // in milliseconds
  var EXPIRATION_INTERVAL = 7 * ONE_DAY;
  var buttonText          = { notSet: 'Always use<br>this source?'
                              , isSet: 'Disable<br>Autoforward'
                              };
  var $reconfirmDialogue  = $('#reconfirm-expired-autoforward');

  // `isValid()` is a method of the `preferenceSetting` object. However, defining
  // it as a property of `preferenceSetting` can cause errors when cloning the
  // object for browser storage. Instead, its context is set by calling it with
  // `isValid.call(preferenceSetting)`
  function isValid() {
    // `timeSet` is, unsurprisingly, a time object set when the preference is
    // created, and remains a reference to that moment; `now` is (re)created
    // anew upon page loads with the retrieval of an existing preferenceSetting.
    var now            = new Date();
    var timeDifference = now.getTime() - this.timeSet.getTime();

    return timeDifference < EXPIRATION_INTERVAL
  }

  function setPreference($button) {
    var linkId = $button.attr('id');
    // the terminal [0] accesses the matching string, setting `sourceName` to the
    // actual matching service identifier, rather than the match array holding it.
    var sourceName = ( linkId.match(/lexis/) || linkId.match(/westlaw/) )[0];
    var preferenceSetting = { sourceName: sourceName
                              , timeSet: new Date() // "Set" here is a past participle
                              };

    localStorage.setItem('autoforward', preferenceSetting, function (err, preference) {
      if ( err ) {
        console.log(err);
      } else {
        $button.html(buttonText.isSet)
               .addClass('btn-warning  js-isPreference')
               .removeClass('btn-default');
      }
    });
  }
  function unsetPreference($button) {
    localStorage.removeItem('autoforward', function (err) {
      if ( err ) {
        console.log(err);
      } else {
        $button.html(buttonText.notSet)
               .removeClass('js-isPreference  btn-warning')
               .addClass('btn-default');
      }
    });
  }
  function displayAlert($button) {
    var $alert = $("\n    <div class=\"autoforward__alert alert alert-warning alert-dismissible\" role=\"alert\">\n      <button type=\"button\" class=\"close\" data-dismiss=\"alert\" aria-label=\"Close\">\n        <span aria-hidden=\"true\">&times;</span>\n      </button>\n\n      The next time you navigate to a Linkresolver page, you will be automatically\n      forwarded to this service. Even refreshing this page.  If you decide to undo\n      this setting at a later date, simply visit <a\n      href=\"https://www.law.cornell.edu/rio\">www.law.cornell.edu/rio</a>.\n    </div>\n    ");

    $button.parent().parent().after($alert);
  }
  function removeAlert() {
    $('.alert').remove();
  }

  function handleAutoforwardPreference() {
    var this$1 = this;

    // Handle autoforward preference, if any
    localStorage.getItem('autoforward', function (err, preference) {
      if ( err ) {
        console.log(err);

        // Autoforwarding logic for valid preferences
      } else if ( preference && isValid.call(preference) ) {
        var linkToPreferredService = $(("#link--" + (preference.sourceName) + "__a"));
        window.location.href = linkToPreferredService.attr('href');

        // Logic for invalid (i.e. expired) preferences
      } else if ( preference ) {
        // substitute the appropriate source name for {{source}}
        var $linkTitle = $(("#link--" + (preference.sourceName) + "__title"));
        var serviceName = $linkTitle.text();
        var $reconfirmTemplate = $('.js-reconfirm__template');

        $reconfirmTemplate.each(function() {
          var $this = $(this);

          $this.text($this.text().replace(/\{\{source\}\}/g, serviceName));
        });

        // reveal reconfirm/dismiss alert box
        $reconfirmDialogue.show();
      }
    });

    // wire up the buttons
    $('.autoforward__btn').click(function (e) {
      var $this = $(this$1);

      if ( $this.hasClass('js-isPreference') ) {
        unsetPreference($this);
        removeAlert();
      } else {
        setPreference($this);
        displayAlert($this);
      }
    });

    $('#js-reconfirm-autoforward').click(function (e) {
      var $this = $(this$1);

      localStorage.getItem('autoforward', function (err, preference) {
        if ( err ) {
          console.log(err);
        } else {
          preference.timeSet = new Date();
          localStorage.setItem('autoforward', preference, function (err, preference) {
            $reconfirmDialogue.hide();
          });
        }
      });
      // at least visibly, setPreference on the other one
      $('#reconfirm-expired-autoforward').hide();
    });

    $('#js-delete-autoforward').click(function (e) {
      var $this = $(this$1);

      unsetPreference($this);
      // at least visibly, setPreference on the other one
      $('#reconfirm-expired-autoforward').hide();
    });
  }

  var clipboard$1        = new Clipboard(".js-clipboard");
  var encodedQuery     = window.location.hash.slice(1);
  var originalCitation = urlDecode(encodedQuery);
  var tooltipText      = 'Copy to Clipboard';

  var $freeSources         = $('#source-list--free');
  var $subscriptionSources = $('#source-list--subscription');
  var $title               = $('#title');
  var $permalink           = $('#permalink__text');

  // Set up the rest of the page
  $title.text(originalCitation);
  $permalink.val(window.location.href);

  // build links and link elements for every relevant source
  forEach(sources, function (source) {
    var currentSource = Source(source);
    var typedCite = Citation.from(originalCitation);

    if ( currentSource.canHandle(typedCite.type) ) {
      insertUrl(currentSource, typedCite);
    } else {
      // <div> containing the link
      source.$anchor.parent().remove();
    }
  });

  // if autoforwarding, handle that before setting up a UI you won't use
  handleAutoforwardPreference();

  // If no free sources can handle (i.e. a wl_database citation), remove that section entirely
  if ( $freeSources.find(".list-group").children().length === 0 ) {
    // Remove the free sources section
    $freeSources.remove();

    // Subscription being the only sources left, move from right to middle
    $subscriptionSources.addClass("col-md-offset-3");
  }

  // Set up clipboard functionality

  // Select the entire text on first click, for ease of manual copy-pasting. This
  // is still potentially useful for a user who misses the (quite obvious) copy
  // button, and as a fallback for browsers like Safari that do not handle the
  // copy button.
  $permalink.mouseup(function() { $(this).select(); });

  if ( document.queryCommandSupported("copy") ) {
    // Replace permalink's static "I'm a link!" icon with tooltipped copy button
    $permalink.parent().append($("\n    <span class=\"input-group-btn\">\n      <button class=\"btn btn-default js-clipboard\" id=\"permalink__btn\" type=\"button\" data-clipboard-target=\"#permalink__text\">\n        <i class=\"glyphicon glyphicon-copy\"></i>\n      </button>\n    </span>\n  "));
    $("#permalink__icon-wrapper").remove();

    $(".js-clipboard").tooltip({ title: tooltipText });

    clipboard$1.on("success", function (e) {
      var $this = $(e.trigger);

      $this.attr("data-original-title", "Copied!")
           .tooltip("show")
           .one("mouseleave", fixTooltipTitle);

      function fixTooltipTitle() {
        $this.attr("data-original-title", tooltipText);
      }
    });
  }

  function insertUrl(source, parsedCitation) {
    var $linkCitation = $("<p class=\"link__citation\"></p>");
    var $linkUrl      = $("<p class=\"link__url\"></p>");
    var url           = source.url(parsedCitation);
    var citationText  = source.canDeepLink(parsedCitation.type)
                          ? parsedCitation.fullCite
                          : parsedCitation.mainCite;

    source.$anchor.attr({
        href: url
      , target: "_blank"
      })
      .append($linkCitation.html(citationText))
      .append($linkUrl.html(url));
  }

}());
