const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetFiltered = `    filteredSales.forEach(s => {
      rec += s.totalPrice;`;

const replacementFiltered = `    filteredSales.forEach(s => {
      const isTemplateRow = s.title.includes('Way Million') && s.quantity === 1 && s.totalPrice < 35 && s.totalPrice > 25;
      if (isTemplateRow) return;
      rec += s.totalPrice;`;

code = code.replace(targetFiltered, replacementFiltered);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched filteredSales to ignore template rows");
