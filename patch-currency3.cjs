const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `            } else if (str.includes(',')) {
               // Only comma, assume pt-BR decimal
               str = str.replace(',', '.');
            } else if (str.includes('.')) {
               // Only dot, assume en-US decimal (do nothing)
            }`;

const replacement = `            } else if (str.includes(',')) {
               if (str.match(/,\\d{2}$/) || str.match(/,\\d$/)) {
                  str = str.replace(',', '.');
               } else {
                  str = str.replace(/,/g, '');
               }
            } else if (str.includes('.')) {
               if (str.match(/^\\d{1,3}\\.\\d{3}$/) || str.match(/^\\d{1,3}(\\.\\d{3})+$/)) {
                  str = str.replace(/\\./g, '');
               }
            }`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched parseCurrency 3!");
} else {
    console.log("Target not found 3!");
}
