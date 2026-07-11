const fs = require('fs');
const rawData = fs.readFileSync('test-parser.cjs', 'utf8').split('\`')[1];
const lines = rawData.split('\n').slice(1).filter(l => l.trim() !== '');

let rec = 0;
let qtd = 0;
for (let j = 0; j < Math.min(83, lines.length); j++) {
    const parts = lines[j].split('\t');
    if (parts.length > 5) {
      qtd += Number(parts[3]) || 0;
      let valStr = parts[5].replace(/[R$\s]/g, '').replace(',', '.');
      rec += parseFloat(valStr) || 0;
    }
}
console.log(`First 83 rows: Qtd = ${qtd}, Rec = ${rec}`);
