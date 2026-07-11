const fs = require('fs');
const rawData = fs.readFileSync('test-parser.cjs', 'utf8').split('\`')[1];
const lines = rawData.split('\n').slice(1).filter(l => l.trim() !== '');

let rec = 0;
let qtd = 0;
let skipped = 0;
for (let j = 0; j < lines.length; j++) {
    const parts = lines[j].split('\t');
    if (parts.length > 5) {
      let q = Number(parts[3]);
      if (isNaN(q)) q = 0;
      qtd += q;
      
      let valStr = parts[5].replace(/[R$\s]/g, '').replace(',', '.');
      let r = parseFloat(valStr);
      if (isNaN(r)) r = 0;
      rec += r;
      
      console.log(`Line ${j+2}: Qtd=${q} Rec=${r} Raw=${lines[j]}`);
    } else {
      skipped++;
      console.log(`Line ${j+2} SKIPPED: ${lines[j]}`);
    }
}
console.log(`Total: Qtd = ${qtd}, Rec = ${rec}, Skipped = ${skipped}`);
