const https = require('https');
https.get("https://docs.google.com/spreadsheets/d/1GV5jhhjmHIgveGAvvi0xfHJVNDk40Lu4nb4RL2eBuqE/gviz/tq?tqx=out:csv&sheet=Junho", (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => console.log(data.substring(0, 1000)));
});
