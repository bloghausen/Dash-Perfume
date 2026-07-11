const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      const meta = await resMeta.json();
      const sheetNames = meta.sheets.map((s: any) => s.properties.title);

      if (sheetNames.length === 0) throw new Error('Nenhuma aba encontrada na planilha.');`;

const replacement = `      const meta = await resMeta.json();
      const sheetNames = meta.sheets.map((s: any) => s.properties.title);

      if (sheetNames.length === 0) throw new Error('Nenhuma aba encontrada na planilha.');

      // Extract month from document title as fallback
      let docMonth = 'Desconhecido';
      if (meta.properties && meta.properties.title) {
         const docTitle = meta.properties.title.trim().toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
         const matchedDoc = mlist.find((mo, idx) => {
             const moNorm = mo.toLowerCase().normalize("NFD").replace(/[\\u0300-\\u036f]/g, "");
             const numStr = String(idx + 1).padStart(2, '0');
             return docTitle.includes(moNorm) || 
                    docTitle.includes(moNorm.substring(0,3)) ||
                    docTitle.includes('/' + numStr + '/') ||
                    docTitle.includes('-' + numStr + '-') ||
                    docTitle.endsWith('/' + numStr) ||
                    docTitle.endsWith('-' + numStr) ||
                    docTitle.startsWith(numStr + '/') ||
                    docTitle.startsWith(numStr + '-');
         });
         if (matchedDoc) docMonth = matchedDoc;
      }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched doc title month!");
} else {
    console.log("Target not found!");
}
