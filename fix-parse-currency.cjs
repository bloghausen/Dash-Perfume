const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const parseCurrency = `
  const parseCurrency = (val: any) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    let str = String(val).trim();
    let isNegative = false;
    if (str.includes('-') || (str.includes('(') && str.includes(')'))) {
       isNegative = true;
    }
    str = str.replace(/[R$\\s%a-zA-Z()\\-]/g, '');
    if (str.includes('.') && str.includes(',')) {
       if (str.indexOf('.') < str.indexOf(',')) {
          str = str.replace(/\\./g, '').replace(',', '.');
       } else {
          str = str.replace(/,/g, '');
       }
    } else if (str.includes(',')) {
       if (str.match(/,\\d{2}$/) || str.match(/,\\d$/)) {
          str = str.replace(',', '.');
       } else {
          str = str.replace(/,/g, '');
       }
    } else if (str.includes('.')) {
       if (str.match(/^\\d{1,3}\\.\\d{3}$/) || str.match(/^\\d{1,3}(\\.\\d{3})+$/)) {
          str = str.replace(/\\./g, '');
       }
    }
    const num = parseFloat(str) || 0;
    return isNegative ? -num : num;
  };
`;

// Remove all occurrences of parseCurrency definition
code = code.replace(/const parseCurrency = \(val: any\) => \{[\s\S]*?return isNegative \? -num : num;\n\s*};\n/g, '');

// Insert it right after syncPublicData definition
code = code.replace("const syncPublicData = async () => {", "const syncPublicData = async () => {\n" + parseCurrency);
code = code.replace("const handleImportGoogleSheet = async () => {", "const handleImportGoogleSheet = async () => {\n" + parseCurrency);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched!");
