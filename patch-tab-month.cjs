const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        let defaultMonth = 'Desconhecido';
        const normalizedTitle = title.trim().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
        const matchedTab = mlist.find((mo, idx) => {`;

const replacement = `        let defaultMonth = typeof docMonth !== 'undefined' ? docMonth : 'Desconhecido';
        const normalizedTitle = title.trim().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
        
        // Only use tab name if it's not generic like "pagina1" or "sheet1"
        if (!normalizedTitle.includes('pagina') && !normalizedTitle.includes('sheet')) {
            const matchedTab = mlist.find((mo, idx) => {
               const moNorm = mo.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
               const numStr = String(idx + 1).padStart(2, '0');
               return normalizedTitle === moNorm || 
                      normalizedTitle.includes(moNorm.substring(0,3)) ||
                      normalizedTitle.includes('/' + numStr + '/') ||
                      normalizedTitle.includes('-' + numStr + '-') ||
                      normalizedTitle.endsWith('/' + numStr) ||
                      normalizedTitle.endsWith('-' + numStr) ||
                      normalizedTitle.startsWith(numStr + '/') ||
                      normalizedTitle.startsWith(numStr + '-') ||
                      normalizedTitle === numStr;
            });
            if (matchedTab) defaultMonth = matchedTab;
        }`;

if (code.includes(target)) {
    // wait, we have to match the whole find thing to replace it properly
    // let's do a more precise replacement using the target that contains the whole find closure!
    console.log("We need to replace the whole block!");
} else {
    console.log("Target not found!");
}
