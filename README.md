# RIO

A citation-parsing and url-building web utility written in javascript. Intended
for legal authors and their readers, it consists of two pages: the [link
builder](#link-builder), found at `./index.html`; and the [link
resolver](#link-resolver) (effectively, the results page), found at
`./citation/index.html`.

## Install / test / watch / build
If you haven't done this before, see [How to use NPM as a build tool](http://blog.keithcirkel.co.uk/how-to-use-npm-as-a-build-tool/)
and [NPM for everything](http://beletsky.net/2015/04/npm-for-everything.html). Cheat sheet:
* Install: `npm install`/`yarn install`
* Test: `./scripts/single-test-run`, or `npm test`/`yarn test` to watch
filesystem and rerun tests with every write
* Watch: `npm run watch`/`yarn watch`
  Compiles the javascript modules into single files suitable for the browser.
  The `watch` command starts a program that will recompile every time a file
  ending in `.js` is saved. For speed, doesn't bother to minimizing the size of
  the scripts; generates source maps for debugging. Ideal for development.
* Build: `npm run build`/`yarn build`
  Similar to `watch`, but optimized for deployments. First it fires off a single
  run of the test suite; if any test fails, the script aborts before doing
  anything else. If all tests are passing (or pending), it performs a one-off
  compilation, minifies the compiled script for faster page loads, and
  prefixes each filename with a 32-character string generated from its contents,
  a cache-busting technique inspired by [Ruby on Rails](http://guides.rubyonrails.org/asset_pipeline.html#what-is-fingerprinting-and-why-should-i-care-questionmark).

## Link Builder
The root url of the app contains the link builder, whose behavior is very simple
indeed: it has a single text input field into which users can type US legal
citations. Upon being given a citation, it simply forwards the user to the link
resolver page for the given citation.

Overview of that process:

* checks the input against a set of whitelisted characters (legal citations use
  a limited set of characters, and restricting input to that set limits users'
  ability to [inject malicious code](https://en.wikipedia.org/wiki/Cross-site_scripting#Non-persistent)
  into the generated urls)
* displays an error message if input validation fails
* otherwise, forwards the user to the link resolver URL for that citation. This
  URL is built by URL-encoding the characters that comprise the citation (using
  a lightly-modified version of `window.encodeURIComponent`) and appending that
  as a query string to the base URL of the link resolver page.

## Link Resolver
Here we find the meat of the app's logic. The code on this page takes as input
the citation encoded in its URL, and produces as output a set of links to the
source text being cited.

Overview of that process:

* finds and decodes the citation string provided by the URL
* parses that citation string to determine its type (i.e. to what sort of
  document it refers, e.g. US Constitution, US Code, court case, etc)
* determines to which sources it can build links for that type of citation
* builds the correct urls for all sources that can handle the given citation
* updates the DOM with final results, filling in the URLs of link tags for
  sources that can handle the citation and removing link tags for sources that
  cannot

There are two fundamental actions that compose the bahavior of the link
resolver: parsing a citation to determine its type and structure, and, given
such a citation, building a URL to it for a particular source. The logic for
each of these actions is encapsulated in a custom object type: respectively,
`Citation` and `Source`. Each type has a constructor function located in
`js/types/{citation,source}.js` which defines its setup process and interface;
each has a corresponding set of config objects in
`js/data/{type,source}_list.js` which enumerates the specifics of each possible
instance of that type.

### Citation
While it is possible to use the `Citation` constructor manually, by giving it as
arguments the text of a citation and the appropriate config object from
`js/data/type_list.js`, it is **strongly** encouraged to use this API instead:

``` javascript
const Citation       = require(`js/types/citation`)
const textOfCitation = `189 F.2d 107`

// Detects type of citation and calls constructor function in one go
Citation.from(textOfCitation)
```

#### Interface

``` javascript
citation.type     :: String // internal typeId, e.g. 'cfr' or 'us_constitution'
citation.fullCite :: String // the entire citation string
citation.mainCite :: String // the citation string with jumpcite, if any, removed
citation.jumpCite :: String // the jumpcite string, if any
```

In addition, `Citation` instances store any subparts defined in their type's
`configObject._subparts || {}` as properties. Thus:

``` javascript
const us_constitution = Citation.from(`U.S. CONST. art. I, § 7, cl. 1`)
us_constitution.fullCite // 'U.S. CONST. art. I, § 7, cl. 1'
us_constitution.mainCite // 'U.S. CONST. art. I, § 7'
us_constitution.jumpCite // ', cl. 1'
us_constitution.article  // 'I'
us_constitution.section  // '7'

const cfr = Citation.from(`45 C.F.R. § 147.130(a)(1)(iv)`)
cfr.fullCite // '45 C.F.R. § 147.130(a)(1)(iv)'
cfr.mainCite // '45 C.F.R. § 147.130'
cfr.jumpCite // '(a)(1)(iv)'
cfr.title    // '45'
cfr.section  // '147.130'
cfr.part     // '147'
```

#### Config
The config object corresponding to each citation type is a plain javascript
object with the following structure:

``` javascript
{ typeId:          String
, idPattern:       RegExp
, mainCitePattern: RegExp
, _subparts:       Object // optional
}
```

| field | role |
|---|---|
| `typeId` | An internal identifier. |
| `idPattern` | Used to "type" a citation: if a given citation text matches a type's `idPattern`, it is of that type. |
| `mainCitePattern` | Matches the subset of the citation before a jump cite, if any. |
| `_subparts` | An object used to parse the specific subparts of a citation type. Each key of `_subparts` is the name of a subpart and stores a function that takes the raw citation text and returns the correct substring for that subpart. |

Types are listed in an array, arranged from least likely to cause a false
positive to most. The final type has the name `default` and is used as a
fallback. It checks against a few common jump cite patterns, in hopes of
providing sane default behavior for types not yet enumerated in the app.

### Source
Sources, in contrast, are instantiated manually, with either:

``` javascript
// These are equivalent
const withNew = new Source(config)
const without = Source(config)
```

The reason being that there is no "selection" process equivalent to detecting a
given citation's type: instead, every object from `js/data/source_list.js` is
built, one by one, into an array (figuratively) of sources for that citation.

#### Interface

``` javascript
source.name    :: String
source.baseUrl :: String
source.$anchor :: jQuery selection

source.canHandle(typeId :: String)   :: Boolean
source.canDeepLink(typeId :: String) :: Boolean

source.url(cite :: Citation) :: String // the url, of course
```

A note about the `source.url` function: it merely dispatches the correct
url-building function for the given `source`/`citation` pair. This is the
implementation:

``` javascript
function url(citation) {
  const urlGetter = this[citation.type] || this._url || genericUrl

  return urlGetter.call(this, citation)
}
```

So a source's config doesn't need to define any url-building function whatsoever
if the default method is sufficient; however, methods of the same name as the
citation's `typeId` always take precedence, followed by the source's custom `_url`
function.

#### Config
The config object corresponding to each source is a plain javascript object with
the following structure:

``` javascript
{ name:               String
, baseUrl:            String
, $anchor:            jQuery selection
, _deepLinkableTypes: [typeIds]
, _cannot:            [typeIds]
, _url:               Function // optional
, _typeSpecificUrls:  Object // optional
}
```

| field | role |
|---|---|
| `name` | The source's display name. |
| `baseUrl` | Used build urls. |
| `$anchor` | Used to manipulate the source's DOM element in the result list. |
| `_deepLinkableTypes` | The list of citation types for which this source should use the `fullCite`, rather than just the `mainCite`. |
| `_cannot` | The list of citation types for which this source should remove itself from the results. |
| `_url` | The url-building function to use when there is no `typeSpecificUrl` function matching the given `Citation`'s type. |
| `_typeSpecificUrls` | Does what it says on the tin. Each key should be a valid `typeId` and store a function that returns the correct url given a `Citation` of that type. |
