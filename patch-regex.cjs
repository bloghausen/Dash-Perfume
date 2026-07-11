const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const regex = /const getVal = \(exactMatches: string\[\], partialMatches: string\[\], avoid: string\[\] = \[\]\) => \{[\s\S]*?return key \? rowObj\[key\] : null;\n           \};/;

const replacement = `const getVal = (exactMatches: string[], partialMatches: string[], avoid: string[] = []) => {
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

if (regex.test(code)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched with regex!");
} else {
    console.log("Regex not found!");
}
