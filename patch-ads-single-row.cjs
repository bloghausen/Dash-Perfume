const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetSync = `        if (lines.length < 2) continue;

        if (tab === 'ADS') {`;

const replacementSync = `        if (tab === 'ADS') {
           hasAdsTab = true;
           const headerRow = parseCsvLine(lines[0] || "");
           let costColIndex = -1;
           for (let c = 0; c < headerRow.length; c++) {
              const h = String(headerRow[c]).toLowerCase();
              if (h.includes('custo') || h.includes('valor') || h.includes('gasto') || h.includes('investimento') || h.includes('ads')) {
                 costColIndex = c; break;
              }
           }
           let cost = 0;
           // If we have a second line, try parsing from there
           if (lines.length >= 2) {
              const row2 = parseCsvLine(lines[1] || "");
              if (costColIndex >= 0 && row2.length > costColIndex) {
                 cost = parseCurrency(row2[costColIndex]);
              } else if (row2.length >= 2) {
                 cost = parseCurrency(row2[1]); // col B
              } else if (row2.length >= 1) {
                 cost = parseCurrency(row2[0]);
              }
              if (!cost) {
                 for (let c = 0; c < row2.length; c++) {
                    const val = parseCurrency(row2[c]);
                    if (val > 0) { cost = val; break; }
                 }
              }
           }
           
           // If cost is still 0 (e.g. single row), scan the first row
           if (!cost) {
              for (let c = 0; c < headerRow.length; c++) {
                 const val = parseCurrency(headerRow[c]);
                 if (val > 0) { cost = val; break; }
              }
           }
           
           newAdsSpend += cost;
           continue;
        }

        if (lines.length < 2) continue;`;

code = code.replace(targetSync, replacementSync);

const targetImport = `        if (values.length < 2) return; // Need header and at least one row
        
        const header = values[0];
        
        let defaultMonth = typeof docMonth !== 'undefined' ? docMonth : 'Desconhecido';
        const normalizedTitle = title.trim().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
        
        if (normalizedTitle === 'ads') {
          hasAdsTab = true;
          const headerRow = values[0] || [];
          let costColIndex = -1;
          for (let c = 0; c < headerRow.length; c++) {
             const h = String(headerRow[c]).toLowerCase();
             if (h.includes('custo') || h.includes('valor') || h.includes('gasto') || h.includes('investimento') || h.includes('ads')) {
                costColIndex = c; break;
             }
          }
          const row2 = values[1] || [];
          let cost = 0;
          if (costColIndex >= 0 && row2.length > costColIndex) {
             cost = parseCurrency(row2[costColIndex]);
          } else if (row2.length >= 2) {
             cost = parseCurrency(row2[1]); // col B
          } else if (row2.length >= 1) {
             cost = parseCurrency(row2[0]);
          }
          if (!cost) {
             for (let c = 0; c < row2.length; c++) {
                const val = parseCurrency(row2[c]);
                if (val > 0) { cost = val; break; }
             }
          }
          newAdsSpend += cost;
          return;
        }`;

const replacementImport = `        let defaultMonth = typeof docMonth !== 'undefined' ? docMonth : 'Desconhecido';
        const normalizedTitle = title.trim().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
        
        if (normalizedTitle === 'ads') {
          hasAdsTab = true;
          const headerRow = values[0] || [];
          let costColIndex = -1;
          for (let c = 0; c < headerRow.length; c++) {
             const h = String(headerRow[c]).toLowerCase();
             if (h.includes('custo') || h.includes('valor') || h.includes('gasto') || h.includes('investimento') || h.includes('ads')) {
                costColIndex = c; break;
             }
          }
          
          let cost = 0;
          if (values.length >= 2) {
              const row2 = values[1] || [];
              if (costColIndex >= 0 && row2.length > costColIndex) {
                 cost = parseCurrency(row2[costColIndex]);
              } else if (row2.length >= 2) {
                 cost = parseCurrency(row2[1]); // col B
              } else if (row2.length >= 1) {
                 cost = parseCurrency(row2[0]);
              }
              if (!cost) {
                 for (let c = 0; c < row2.length; c++) {
                    const val = parseCurrency(row2[c]);
                    if (val > 0) { cost = val; break; }
                 }
              }
          }
          
          if (!cost) {
              for (let c = 0; c < headerRow.length; c++) {
                 const val = parseCurrency(headerRow[c]);
                 if (val > 0) { cost = val; break; }
              }
          }
          newAdsSpend += cost;
          return;
        }

        if (values.length < 2) return; // Need header and at least one row
        const header = values[0];`;

code = code.replace(targetImport, replacementImport);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched single row logic for ADS");
