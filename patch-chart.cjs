const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    let lastIndex = -1;
    for (let i = monthlyChartDataAll.length - 1; i >= 0; i--) {
        if (monthlyChartDataAll[i].receita > 0 || monthlyChartDataAll[i].lucro > 0) {
            lastIndex = i;
            break;
        }
    }`;

const replacement = `    let lastIndex = -1;
    for (let i = monthlyChartDataAll.length - 1; i >= 0; i--) {
        if (monthlyChartDataAll[i].receita > 50 || monthlyChartDataAll[i].quantidade > 1) {
            lastIndex = i;
            break;
        }
    }`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched chart data trailing filter");
