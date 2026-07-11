const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `const ranges = sheetNames.map((n: string) => \`ranges=\${encodeURIComponent("'" + n + "'!A1:ZZ5000")}\`).join('&');`;
const replacement = `const ranges = sheetNames.map((n: string) => \`ranges=\${encodeURIComponent("'" + n + "'")}\`).join('&');`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched limit!");
} else {
    console.log("Target not found!");
}
