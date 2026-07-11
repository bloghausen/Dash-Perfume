const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `          let parsedQuantity = Number(quantityRaw);
          if (isNaN(parsedQuantity) && quantityRaw !== 0 && quantityRaw !== '0') parsedQuantity = 1;`;

const replacement = `          let parsedQuantity = 1;
          if (quantityRaw !== null && quantityRaw !== undefined && String(quantityRaw).trim() !== '') {
             parsedQuantity = Number(String(quantityRaw).replace(',', '.'));
             if (isNaN(parsedQuantity)) parsedQuantity = 1;
          }
          if (parsedQuantity === 0) {
             parsedQuantity = 1;
          }`;

if (code.includes(target)) {
  fs.writeFileSync('src/App.tsx', code.replace(target, replacement));
  console.log("Patched qty2");
} else {
  console.log("Target qty2 not found");
}
