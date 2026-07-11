const XLSX = require('xlsx');
const csv = "a,b,c\n1,2,3";
const wb = XLSX.read(csv, {type: 'binary'});
console.log(wb.SheetNames);
