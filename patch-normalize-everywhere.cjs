const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const replacement = `      // normalize for old data
      const mkt = normalizeMarketplace(s.marketplace);
      mktMap[mkt] = (mktMap[mkt] || 0) + s.totalPrice;`;

code = code.replace("mktMap[s.marketplace] = (mktMap[s.marketplace] || 0) + s.totalPrice;", replacement);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched normalize inside loop");
