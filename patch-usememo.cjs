const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetUseMemo = `    sales.forEach(s => {
       if (!monthMap[s.month]) monthMap[s.month] = { receita: 0, lucro: 0, quantidade: 0 };`;

const replacementUseMemo = `    sales.forEach(s => {
       const isTemplateRow = s.title.includes('Way Million') && s.quantity === 1 && s.totalPrice < 35 && s.totalPrice > 25;
       if (isTemplateRow) return;

       if (!monthMap[s.month]) monthMap[s.month] = { receita: 0, lucro: 0, quantidade: 0 };`;

code = code.replace(targetUseMemo, replacementUseMemo);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched useMemo to filter template rows");
