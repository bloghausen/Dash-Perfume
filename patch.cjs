const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');
const target = `          // Skip completely empty rows
          const isEmptyRow = rowValues.every((v: any) => v === null || v === undefined || String(v).trim() === '');
          if (isEmptyRow) continue;`;

const replacement = `          // Skip completely empty rows
          const isEmptyRow = rowValues.every((v: any) => v === null || v === undefined || String(v).trim() === '');
          if (isEmptyRow) continue;

          // Skip total/summary rows
          const isTotalRow = rowValues.slice(0, 3).some((v: any) => {
              const str = String(v).trim().toLowerCase();
              return str === 'total' || str === 'totais' || str === 'resultado' || str === 'soma';
          });
          if (isTotalRow) continue;`;

if (code.includes(target)) {
  fs.writeFileSync('src/App.tsx', code.replace(target, replacement));
  console.log("Patched successfully.");
} else {
  console.log("Target not found!");
}
