const fs = require('fs');
const rawData = fs.readFileSync('test-parser.cjs', 'utf8').split('\`')[1];
const lines = rawData.split('\n').slice(1).filter(l => l.trim() !== '');

for (let i = 1; i <= lines.length; i++) {
  let qtd = 0;
  let rec = 0;
  for (let j = 0; j < i; j++) {
    const parts = lines[j].split('\t');
    if (parts.length > 5) {
      qtd += Number(parts[3]) || 0;
      let valStr = parts[5].replace(/[R$\s]/g, '').replace(',', '.');
      rec += parseFloat(valStr) || 0;
    }
  }
  if (qtd === 83 || Math.abs(rec - 2355.5) < 0.1) {
    console.log(`Matched at line ${i}! Qtd: ${qtd}, Rec: ${rec}`);
  }
}
