const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// Patch syncPublicData
const targetSync = `        if (lines.length < 2) continue;

        let headerRowIndex = 0;`;

const replacementSync = `        if (lines.length < 2) continue;

        if (tab === 'ADS') {
           hasAdsTab = true;
           const row2 = parseCsvLine(lines[1] || "");
           if (row2 && row2.length >= 2) {
               newAdsSpend += parseCurrency(row2[1]);
           }
           continue;
        }

        let headerRowIndex = 0;`;
code = code.replace(targetSync, replacementSync);

const targetSyncRemoveADS1 = `           if (tab === 'ADS') {
              if (rowStr.includes('valor') || rowStr.includes('custo') || rowStr.includes('gasto') || rowStr.includes('investimento') || rowStr.includes('total')) score++;
           } else {
              if (rowStr.includes('valor') || rowStr.includes('preço') || rowStr.includes('faturamento') || rowStr.includes('recebido')) score++;
              if (rowStr.includes('total')) score++;
              if (rowStr.includes('lucro') || rowStr.includes('líquido') || rowStr.includes('liquido') || rowStr.includes('resultado')) score++;
              if (rowStr.includes('produto') || rowStr.includes('título') || rowStr.includes('nome') || rowStr.includes('descri') || rowStr.includes('item') || rowStr.includes('peça')) score++;
           }`;
const replacementSyncRemoveADS1 = `           if (rowStr.includes('valor') || rowStr.includes('preço') || rowStr.includes('faturamento') || rowStr.includes('recebido')) score++;
           if (rowStr.includes('total')) score++;
           if (rowStr.includes('lucro') || rowStr.includes('líquido') || rowStr.includes('liquido') || rowStr.includes('resultado')) score++;
           if (rowStr.includes('produto') || rowStr.includes('título') || rowStr.includes('nome') || rowStr.includes('descri') || rowStr.includes('item') || rowStr.includes('peça')) score++;`;

code = code.replace(targetSyncRemoveADS1, replacementSyncRemoveADS1);

const targetSyncRemoveADS2 = `           if (tab === 'ADS') {
             hasAdsTab = true;
             const cost = parseCurrency(getVal(['Valor', 'Custo', 'Gasto', 'Investimento', 'Total'], ['valor', 'custo', 'gasto', 'investimento', 'total']));
             newAdsSpend += cost;
           } else {
             let parsedQuantity = 1;`;
const replacementSyncRemoveADS2 = `             let parsedQuantity = 1;`;
code = code.replace(targetSyncRemoveADS2, replacementSyncRemoveADS2);

const targetSyncRemoveADS3 = `             if (!isEmptyRow) {
                newSales.push(s);
             }
           }`;
const replacementSyncRemoveADS3 = `             if (!isEmptyRow) {
                newSales.push(s);
             }`;
code = code.replace(targetSyncRemoveADS3, replacementSyncRemoveADS3);

// Patch handleImportGoogleSheet
const targetImport = `        if (normalizedTitle === 'ads') {
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
        }`;

const replacementImport = `        if (normalizedTitle === 'ads') {
          hasAdsTab = true;
          const row2 = values[1] || [];
          if (row2 && row2.length >= 2) {
             newAdsSpend += parseCurrency(row2[1]);
          }
          return;
        }`;
code = code.replace(targetImport, replacementImport);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched ADS cost logic");
