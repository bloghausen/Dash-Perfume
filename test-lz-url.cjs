const url = new URL('http://example.com');
url.searchParams.set('d', 'a+b');
console.log("url str:", url.toString());
const url2 = new URL(url.toString());
console.log("get d:", url2.searchParams.get('d'));
