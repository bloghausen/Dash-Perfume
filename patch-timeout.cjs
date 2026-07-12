const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("const data = await fetchDashboard('main');", `
      // Timeout de 3 segundos para não travar a tela
      const data = await Promise.race([
        fetchDashboard('main'),
        new Promise<null>(resolve => setTimeout(() => resolve(null), 3000))
      ]);
`);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched timeout!");
