const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            let isNegative = false;
            if (str.startsWith('-') || (str.startsWith('(') && str.endsWith(')'))) {
               isNegative = true;
            }`;

const replacement = `            let isNegative = false;
            if (str.includes('-') || (str.includes('(') && str.includes(')'))) {
               isNegative = true;
            }`;

if (code.includes(target)) {
  fs.writeFileSync('src/App.tsx', code.replace(target, replacement));
  console.log("Patched negative successfully.");
} else {
  console.log("Target negative not found!");
}
