const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

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
             let key = keys.find(k => exactMatches.some(e => k.toLowerCase() === e.toLowerCase()));
             if (key) return rowObj[key];
             
             key = keys.find(k => {
                const kl = k.toLowerCase();
                if (avoid.some(a => kl.includes(a.toLowerCase()))) return false;
                return partialMatches.some(p => kl.includes(p.toLowerCase()));
             });
             return key ? rowObj[key] : null;
           };`;

code = code.replace(target, replacement);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched!");
