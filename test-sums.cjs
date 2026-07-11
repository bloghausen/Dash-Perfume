const fs = require('fs');
const rawData = fs.readFileSync('test-parser.cjs', 'utf8').split('\`')[1];
const lines = rawData.split('\n').slice(1).filter(l => l.trim() !== '');

let sums = Array(20).fill(0);
let header = lines[0].split('\t');

for (let j = 1; j < lines.length; j++) {
    const parts = lines[j].split('\t');
    for (let c = 3; c < parts.length; c++) {
      let valStr = parts[c].replace(/[R$\s%]/g, '').replace(',', '.');
      let val = parseFloat(valStr);
      if (!isNaN(val)) {
         sums[c] += val;
      }
    }
}
for (let c = 3; c < sums.length; c++) {
  if (header[c]) {
     console.log(`${header[c]}: ${sums[c]}`);
  }
}
