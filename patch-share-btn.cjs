const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `                          {!new URLSearchParams(window.location.search).get('id') && (`;

const replacement = `                          {!new URLSearchParams(window.location.search).get('id') && !isReadonly && (`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched share btn!");
} else {
    console.log("Target not found!");
}
