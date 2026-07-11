const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `    const prodData = Object.entries(prodMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);`;

const replacement = `    const prodData = Object.entries(prodMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('src/App.tsx', code);
    console.log("Patched prodData slice!");
} else {
    console.log("Target not found!");
}
