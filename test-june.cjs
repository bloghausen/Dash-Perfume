const https = require('https');

https.get("https://docs.google.com/spreadsheets/d/1GV5jhhjmHIgveGAvvi0xfHJVNDk40Lu4nb4RL2eBuqE/gviz/tq?tqx=out:csv&sheet=Junho", (res) => {
  let data = '';
  res.on('data', d => data += d);
  res.on('end', () => {
    const lines = data.split('\n');
    console.log(`Total lines: ${lines.length}`);
    console.log('Headers:', lines[0]);
    console.log('Last lines:', lines.slice(-5));
  });
});
