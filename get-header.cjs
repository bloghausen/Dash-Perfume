const fs = require('fs');
const rawData = fs.readFileSync('test-parser.cjs', 'utf8').split('\`')[1];
const lines = rawData.split('\n').slice(1).filter(l => l.trim() !== '');
console.log(lines[0].split('\t').map((c, i) => i + ": " + c).join('\n'));
