const fs = require('fs');
const file = 'src/components/MarketplaceLogo.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `  if (q.includes('temu')) return 'temu.com';
  if (q.includes('amazon')) return 'amazon.com';`;

const replacement = `  if (q.includes('temu')) return 'temu.com';
  if (q.includes('shein')) return 'shein.com';
  if (q.includes('amazon')) return 'amazon.com';`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched shein logo!");
} else {
    console.log("Target not found!");
}
