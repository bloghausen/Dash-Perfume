const fs = require('fs');
const app = fs.readFileSync('src/App.tsx', 'utf8');

// just to double check
console.log("App logic length:", app.length);
