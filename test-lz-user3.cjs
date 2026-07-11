const LZString = require('lz-string');
const data = { a: "hello world + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more + test + more and more and more" };
const compressed = LZString.compressToEncodedURIComponent(JSON.stringify(data));
console.log("compressed has +?", compressed.includes('+'));
console.log("compressed has %2B?", compressed.includes('%2B'));
console.log("compressed has -?", compressed.includes('-'));
