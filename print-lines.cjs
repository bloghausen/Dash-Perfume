const fs = require('fs');
const rawData = fs.readFileSync('test-parser.cjs', 'utf8').split('\`')[1];
const lines = rawData.split('\n').slice(1).filter(l => l.trim() !== '');

console.log('Line 77:', lines[76]);
console.log('Line 78:', lines[77]);
console.log('Line 79:', lines[78]);
console.log('Line 80:', lines[79]);
