const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("if (data) {", `
      if (data && data.sales && data.sales.length > 0) {
`);

code = code.replace("setIsLoaded(true);\n      }", `setIsLoaded(true);\n      } else {\n         // Fallback to public sheet if db is empty or failed\n         syncPublicData();\n      }`);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched fallback!");
