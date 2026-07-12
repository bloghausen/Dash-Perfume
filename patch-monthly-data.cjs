const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const monthlyChartData = mlist.map(m => {
       const data = monthMap[m] || { receita: 0, lucro: 0, quantidade: 0 };
       return { name: m, ...data };
    }).filter(m => m.receita > 0 || m.lucro > 0 || m.quantidade > 0);`;

const replacement = `    const monthlyChartDataAll = mlist.map(m => {
       const data = monthMap[m] || { receita: 0, lucro: 0, quantidade: 0 };
       return { name: m, ...data };
    });
    
    let lastIndex = -1;
    for (let i = monthlyChartDataAll.length - 1; i >= 0; i--) {
        if (monthlyChartDataAll[i].receita > 0 || monthlyChartDataAll[i].lucro > 0) {
            lastIndex = i;
            break;
        }
    }
    
    const monthlyChartData = lastIndex >= 0 ? monthlyChartDataAll.slice(0, lastIndex + 1) : [];`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched monthlyChartData");
