const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `      const compressedData = LZString.compressToEncodedURIComponent(JSON.stringify({ sales, adsSpend, lastSyncDate }));
      url.searchParams.set('d', compressedData);`;

const replacement = `      const compressedData = LZString.compressToEncodedURIComponent(JSON.stringify({ sales, adsSpend, lastSyncDate }));
      url.searchParams.set('d', compressedData);
      url.searchParams.set('readonly', 'true');`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched link generation to add readonly=true!");
} else {
    console.log("Target not found!");
}
