const url = new URL('http://example.com/?d=a+b');
console.log("get d:", url.searchParams.get('d'));
