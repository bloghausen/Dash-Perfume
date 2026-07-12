const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace('{marketplaceData.slice(0,6).map((m, i) => (', '{marketplaceData.map((m, i) => (');
code = code.replace('{marketplaceData.slice(0,4).map((m, i) => (', '{marketplaceData.map((m, i) => ('); // Just in case

fs.writeFileSync('src/App.tsx', code);
console.log("Patched slice limit to all");
