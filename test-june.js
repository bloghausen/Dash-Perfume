const fs = require('fs');

async function test() {
  const url = 'https://docs.google.com/spreadsheets/d/1GV5jhhjmHIgveGAvvi0xfHJVNDk40Lu4nb4RL2eBuqE/gviz/tq?tqx=out:csv&sheet=Junho';
  const res = await fetch(url);
  const text = await res.text();
  const lines = text.split('\n');
  console.log(`Total lines: ${lines.length}`);
  console.log('Headers:', lines[0]);
  console.log('Last lines:', lines.slice(-5));
}
test();
