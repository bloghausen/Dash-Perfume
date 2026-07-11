const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `        const matchedTab = mlist.find(mo => {
           const moNorm = mo.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
           return normalizedTitle === moNorm || normalizedTitle.includes(moNorm.substring(0,3));
        });`;

const replacement = `        const matchedTab = mlist.find((mo, idx) => {
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
        });`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched month matching!");
} else {
    console.log("Target not found!");
}
