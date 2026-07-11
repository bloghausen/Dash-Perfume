const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 }`;
const replacement1 = `toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 }`;

if (code.includes(target1)) {
  const newCode = code.split(target1).join(replacement1);
  fs.writeFileSync('src/App.tsx', newCode);
  console.log("Patched cards.");
} else {
  console.log("Target cards not found!");
}
