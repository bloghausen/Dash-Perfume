const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetSync = `        if (tab === 'ADS') {
           hasAdsTab = true;
           const row2 = parseCsvLine(lines[1] || "");
           if (row2 && row2.length >= 2) {
               newAdsSpend += parseCurrency(row2[1]);
           }
           continue;
        }`;

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
           const row2 = parseCsvLine(lines[1] || "");
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
           continue;
        }`;

code = code.replace(targetSync, replacementSync);

const targetImport = `        if (normalizedTitle === 'ads') {
          hasAdsTab = true;
          const row2 = values[1] || [];
          if (row2 && row2.length >= 2) {
             newAdsSpend += parseCurrency(row2[1]);
          }
          return;
        }`;

const replacementImport = `        if (normalizedTitle === 'ads') {
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

code = code.replace(targetImport, replacementImport);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched robust ADS cost extraction");
