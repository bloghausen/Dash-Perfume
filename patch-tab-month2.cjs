const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        let defaultMonth = 'Desconhecido';
        const normalizedTitle = title.trim().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
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
        if (matchedTab) defaultMonth = matchedTab;`;

const replacement = `        let defaultMonth = typeof docMonth !== 'undefined' ? docMonth : 'Desconhecido';
        const normalizedTitle = title.trim().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
        if (!normalizedTitle.includes('pagina') && !normalizedTitle.includes('sheet') && !normalizedTitle.includes('planilha')) {
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
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched tab logic!");
} else {
    console.log("Target not found!");
}
