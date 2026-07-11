const LZString = require('lz-string');
const data = { a: "hello world + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more" };
const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(data));
const url = new URL('http://example.com');
url.searchParams.set('d', compressed);
const finalUrl = url.toString();
const extracted = new URL(finalUrl).searchParams.get('d');
const decompressed = LZString.decompressFromEncodedURIComponent(extracted);
console.log("Works?", decompressed !== null);
