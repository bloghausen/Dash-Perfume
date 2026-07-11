const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `           const getVal = (exactMatches: string[], partialMatches: string[], avoid: string[] = []) => {
             const keys = Object.keys(rowObj);
             const hasValue = (k: string) => {
                const val = rowObj[k];
                return val !== undefined && val !== null && String(val).trim() !== '';
             };
             let key = keys.find(k => exactMatches.some(e => k.toLowerCase() === e.toLowerCase()) && hasValue(k));
             if (key) return rowObj[key];
             
             key = keys.find(k => {
                const kl = k.toLowerCase();
                if (avoid.some(a => kl.includes(a.toLowerCase()))) return false;
                if (!hasValue(k)) return false;
                return partialMatches.some(p => kl.includes(p.toLowerCase()));
             });
             return key ? rowObj[key] : null;
           };`;

const replacement = `           const getVal = (exactMatches: string[], partialMatches: string[], avoid: string[] = []) => {
             const keys = Object.keys(rowObj);
             
             // First try to find a column by exact match (regardless of whether it has a value in this specific row)
             let key = keys.find(k => exactMatches.some(e => k.toLowerCase() === e.toLowerCase()));
             
             // If not found, try partial match (avoiding forbidden keywords)
             if (!key) {
                 key = keys.find(k => {
                    const kl = k.toLowerCase();
                    if (avoid.some(a => kl.includes(a.toLowerCase()))) return false;
                    return partialMatches.some(p => kl.includes(p.toLowerCase()));
                 });
             }
             
             return key ? rowObj[key] : null;
           };`;

if (code.includes(target)) {
  fs.writeFileSync('src/App.tsx', code.replace(target, replacement));
  console.log("Patched getVal!");
} else {
  console.log("Target getVal not found");
}
