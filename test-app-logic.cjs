const fs = require('fs');

const rawData = fs.readFileSync('test-parser.cjs', 'utf8').split('\`')[1];
const rows = rawData.split('\n').filter(l => l.trim() !== '').map(l => l.split('\t'));

const header = rows[0];

const getVal = (rowValues, exactMatches, partialMatches, excludeMatches = []) => {
    const idx = header.findIndex((h) => {
        if (!h) return false;
        const norm = String(h).toLowerCase().trim();
        if (excludeMatches.some(ex => norm.includes(ex.toLowerCase()))) return false;
        if (exactMatches.some(m => norm === m.toLowerCase())) return true;
        if (partialMatches.some(m => norm.includes(m.toLowerCase()))) return true;
        return false;
    });
    return idx >= 0 ? rowValues[idx] : undefined;
};

const parseCurrency = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    let str = String(val).trim();
    let isNegative = false;
    if (str.includes('-') || (str.includes('(') && str.includes(')'))) {
        isNegative = true;
    }
    str = str.replace(/[R$\s%a-zA-Z()\-]/g, '');
    if (str.includes('.') && str.includes(',')) {
        if (str.indexOf('.') < str.indexOf(',')) {
            str = str.replace(/\./g, '').replace(',', '.');
        } else {
            str = str.replace(/,/g, '');
        }
    } else if (str.includes(',')) {
        str = str.replace(',', '.');
    }
    const num = parseFloat(str) || 0;
    return isNegative ? -num : num;
};

let rec = 0;
let qtd = 0;
for (let i = 1; i < rows.length; i++) {
    const rowValues = rows[i];
    
    // Skip empty
    if (rowValues.every((v) => v === null || v === undefined || String(v).trim() === '')) continue;
    // Skip total
    if (rowValues.slice(0, 3).some((v) => ['total', 'totais', 'resultado', 'soma'].includes(String(v).trim().toLowerCase()))) continue;
    
    let quantityRaw = getVal(rowValues, ['Quantidade', 'Qtd', 'Qtde'], ['quantidad', 'qtd']);
    let parsedQuantity = Number(quantityRaw);
    if (isNaN(parsedQuantity) && quantityRaw !== 0 && quantityRaw !== '0') parsedQuantity = 1;
    
    let totalPrice = parseCurrency(getVal(rowValues, ['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Pago', 'Venda', 'Faturamento', 'Bruto', 'Subtotal'], ['preço tota', 'total', 'valor', 'recebido', 'pago', 'venda', 'faturamento', 'bruto', 'subtotal'], ['taxa', 'frete', 'custo', 'líquido', 'liquido']));
    
    qtd += parsedQuantity;
    rec += totalPrice;
}

console.log(`Final Qtd: ${qtd}`);
console.log(`Final Rec: ${rec}`);
