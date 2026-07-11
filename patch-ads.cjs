const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const parseCurrency = `
      const parseCurrency = (val: any) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        let str = String(val).trim();
        let isNegative = false;
        if (str.includes('-') || (str.includes('(') && str.includes(')'))) {
           isNegative = true;
        }
        str = str.replace(/[R$\\s%a-zA-Z()\\-]/g, '');
        
        // Check for pt-BR vs en-US
        if (str.includes('.') && str.includes(',')) {
           if (str.indexOf('.') < str.indexOf(',')) {
              // pt-BR: 1.234,56
              str = str.replace(/\\./g, '').replace(',', '.');
           } else {
              // en-US: 1,234.56
              str = str.replace(/,/g, '');
           }
        } else if (str.includes(',')) {
           if (str.match(/,\\d{2}$/) || str.match(/,\\d$/)) {
              str = str.replace(',', '.');
           } else {
              str = str.replace(/,/g, '');
           }
        } else if (str.includes('.')) {
           if (str.match(/^\\d{1,3}\\.\\d{3}$/) || str.match(/^\\d{1,3}(\\.\\d{3})+$/)) {
              str = str.replace(/\\./g, '');
           }
        }
        const num = parseFloat(str) || 0;
        return isNegative ? -num : num;
      };
`;

code = code.replace("const newSales: SaleRecord[] = [];", parseCurrency + "\n      const newSales: SaleRecord[] = [];\n      let newAdsSpend = 0;\n      let hasAdsTab = false;");

const adsLogic = `
        if (normalizedTitle === 'ads') {
          hasAdsTab = true;
          // Find the column containing the cost
          let headerRowIndex = 0;
          let maxScore = -1;
          for (let r = 0; r < Math.min(values.length, 50); r++) {
             const rowArr = values[r] || [];
             const rowStr = rowArr.join(' ').toLowerCase();
             let score = 0;
             if (rowStr.includes('valor') || rowStr.includes('custo') || rowStr.includes('gasto') || rowStr.includes('investimento') || rowStr.includes('total')) score++;
             if (score > maxScore && score > 0) {
                maxScore = score;
                headerRowIndex = r;
             }
          }
          const actualHeader = values[headerRowIndex] || [];
          
          for (let i = headerRowIndex + 1; i < values.length; i++) {
             const rowValues = values[i] || [];
             const rowObj: any = {};
             actualHeader.forEach((h: string, idx: number) => {
                if (h && String(h).trim()) rowObj[String(h).trim()] = rowValues[idx];
             });
             
             const getVal = (exactMatches: string[], partialMatches: string[], avoid: string[] = []) => {
               const keys = Object.keys(rowObj);
               let key = keys.find(k => exactMatches.some(e => k.toLowerCase() === e.toLowerCase()));
               if (key) return rowObj[key];
               
               key = keys.find(k => {
                  const kl = k.toLowerCase();
                  if (avoid.some(a => kl.includes(a.toLowerCase()))) return false;
                  return partialMatches.some(p => kl.includes(p.toLowerCase()));
               });
               return key ? rowObj[key] : null;
             };
             
             const cost = parseCurrency(getVal(['Valor', 'Custo', 'Gasto', 'Investimento', 'Total'], ['valor', 'custo', 'gasto', 'investimento', 'total']));
             newAdsSpend += cost;
          }
          
          return;
        }
`;

code = code.replace("if (!normalizedTitle.includes('pagina')", adsLogic + "\n        if (!normalizedTitle.includes('pagina')");

// Also remove parseCurrency inside to avoid redeclaration, but it's ok, inner function hides outer one.
// Let's remove the inner parseCurrency declaration completely and just let it use the outer one.
code = code.replace(/const parseCurrency = \(val: any\) => \{[\s\S]*?return isNegative \? -num : num;\n\s*};\n/m, '');

// Finally, update the adsSpend state if we found the ADS tab
code = code.replace("setSales(newSales);", "setSales(newSales);\n      if (hasAdsTab) setAdsSpend(String(newAdsSpend));");

fs.writeFileSync('src/App.tsx', code);
console.log("Patched!");
