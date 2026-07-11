const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            } else if (str.includes(',')) {
               // Only comma, assume pt-BR decimal
               str = str.replace(',', '.');
            } else {
               // Only dot, assume en-US decimal (do nothing)
            }`;

const replacement = `            } else if (str.includes(',')) {
               // Only comma
               if (str.match(/,\\d{2}$/) || str.match(/,\\d$/)) {
                  str = str.replace(',', '.');
               } else {
                  str = str.replace(/,/g, ''); // 1,234 -> 1234
               }
            } else if (str.includes('.')) {
               // Only dot
               if (str.match(/^\\d{1,3}\\.\\d{3}$/)) {
                  str = str.replace(/\\./g, ''); // 1.234 -> 1234
               }
            }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched parseCurrency 2!");
} else {
    console.log("Target not found!");
}
