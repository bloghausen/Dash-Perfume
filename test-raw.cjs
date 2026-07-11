const fs = require('fs');

const lines = fs.readFileSync('test-data.csv', 'utf8').split('\n').filter(l => l.trim().length > 0);
const headers = lines[0].split('\t');

let revenue = 0;
let profit = 0;
let qty = 0;
let count = 0;

for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split('\t');
    if (cols.length < 5) continue;
    
    // Preço Total is index 5
    // Quantidade is index 3
    // Lucro is index 16
    let pt = cols[5].replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    let luc = cols[16].replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
    let q = cols[3].trim();
    
    revenue += parseFloat(pt) || 0;
    profit += parseFloat(luc) || 0;
    qty += parseFloat(q) || 0;
    count++;
}

console.log(`Raw Count: ${count}, Qty: ${qty}, Revenue: ${revenue.toFixed(2)}, Profit: ${profit.toFixed(2)}`);
