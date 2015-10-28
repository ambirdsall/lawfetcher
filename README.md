# Link Resolver

A utility written in javascript (using jQuery for DOM manipulation and some
utilities). Intended for legal authors and their readers, it consists of two
parts: the link builder, found at `./index.html`; and the link resolver, found
at `./search/index.html`.

## The Link Builder
This page, intended for legal authors, is relatively simple. Given a citation,
it:
* checks against a set of whitelisted characters (legal citations use a fairly
  small set of characters, and it would be rotten to send malicious code along to
  other websites) and, depending of the result, either displays an error message
  or:
* URL-encodes the characters and appends the citation as a query string to the
  URL of the link resolver. This link is both provided per se and further
  encoded as an HTML <a> tag.

## The Link Resolver
Readers, having followed a link from the hypothetical author above, find the
meat of the app's logic. The citation is retrieved from the query string and
decoded, and then:
* the type of the citation is determined (there is a default type if it can't be
  determined)
* parsed into a `Citation` object, with separately
