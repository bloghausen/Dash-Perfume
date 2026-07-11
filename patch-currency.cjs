const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `          const parseCurrency = (val: any) => {
            if (typeof val === 'number') return val;
            if (!val) return 0;
            let str = String(val).trim();
            let isNegative = false;
            if (str.includes('-') || (str.includes('(') && str.includes(')'))) {
               isNegative = true;
            }
            str = str.replace(/[R$\\s]/g, '');
            // Handle typical Brazilian currency format (1.234,56)
            if (str.match(/\\d+\\.\\d{3},\\d{2}/) || str.match(/\\d+,\\d{2}$/)) {
               str = str.replace(/\\./g, '').replace(',', '.');
            } else if (str.match(/\\d+,\\d+$/)) {
               // Handle simpler comma cases like "1,5" -> "1.5"
               str = str.replace(',', '.');
            } else {
               // Only dot, assume en-US decimal (do nothing)
            }
            const num = parseFloat(str) || 0;
            return isNegative ? -num : num;
          };`;

const replacement = `          const parseCurrency = (val: any) => {
            if (typeof val === 'number') return val;
            if (!val) return 0;
            let str = String(val).trim();
            let isNegative = false;
            if (str.includes('-') || (str.includes('(') && str.includes(')'))) {
               isNegative = true;
            }
            str = str.replace(/[R$\\s]/g, '');
            
            // If it has both dot and comma (e.g. 1.234,56)
            if (str.includes('.') && str.includes(',')) {
               // If comma is after dot, it's Brazilian
               if (str.lastIndexOf(',') > str.lastIndexOf('.')) {
                  str = str.replace(/\\./g, '').replace(',', '.');
               } else {
                  // If dot is after comma, it's US (e.g. 1,234.56)
                  str = str.replace(/,/g, '');
               }
            } 
            // If it only has comma (e.g. 1234,56 or 1,234)
            else if (str.includes(',')) {
               // If there are exactly 2 digits after comma, it's likely decimals
               if (str.match(/,\\d{2}$/) || str.match(/,\\d$/)) {
                  str = str.replace(',', '.');
               } else {
                  // Otherwise it might be a thousands separator (e.g. 1,234)
                  str = str.replace(/,/g, '');
               }
            }
            // If it only has dot (e.g. 1234.56 or 1.234)
            else if (str.includes('.')) {
               // If there are exactly 3 digits after dot and no other dots, it might be Brazilian thousands! (1.234)
               if (str.match(/^\\d{1,3}\\.\\d{3}$/)) {
                  str = str.replace(/\\./g, '');
               }
            }

            const num = parseFloat(str) || 0;
            return isNegative ? -num : num;
          };`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched parseCurrency!");
} else {
    console.log("Target not found!");
}
