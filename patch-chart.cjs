const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const monthlyChartData = Object.keys(monthMap)
       .map(m => ({ name: m, ...monthMap[m] }))
       .sort((a, b) => {
           let ia = mlist.findIndex(mo => mo.toLowerCase() === a.name.toLowerCase());
           let ib = mlist.findIndex(mo => mo.toLowerCase() === b.name.toLowerCase());
           if (ia === -1) ia = 99;
           if (ib === -1) ib = 99;
           return ia - ib;
       });`;

const replacement = `    const monthlyChartData = mlist.map(m => {
       const data = monthMap[m] || { receita: 0, lucro: 0, quantidade: 0 };
       return { name: m, ...data };
    });`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched chart data!");
} else {
    console.log("Target not found!");
}
