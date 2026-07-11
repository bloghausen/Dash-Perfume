const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const monthlyChartData = mlist.map(m => {
       const data = monthMap[m] || { receita: 0, lucro: 0, quantidade: 0 };
       return { name: m, ...data };
    });`;

const replacement = `    const monthlyChartData = mlist.map(m => {
       const data = monthMap[m] || { receita: 0, lucro: 0, quantidade: 0 };
       return { name: m, ...data };
    }).filter(m => m.receita > 0 || m.lucro > 0 || m.quantidade > 0);`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched chart data to filter out zeros!");
} else {
    console.log("Target not found!");
}
