const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `          let parsedQuantity = Number(quantityRaw);
          if (isNaN(parsedQuantity) || parsedQuantity === 0) parsedQuantity = 1;`;

const replacement = `          let parsedQuantity = Number(quantityRaw);
          if (isNaN(parsedQuantity) && quantityRaw !== 0 && quantityRaw !== '0') parsedQuantity = 1;`;

if (code.includes(target)) {
  fs.writeFileSync('src/App.tsx', code.replace(target, replacement));
  console.log("Patched qty successfully.");
} else {
  console.log("Target qty not found!");
}
