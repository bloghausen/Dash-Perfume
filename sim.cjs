const fs = require('fs');

const rawData = `Marketplace	SKU Externo	Título	Quantidade	Preço Unitário	Preço Total	Comissão	Taxa de Envio	Frete recebido	Taxa de Serviço	Cupom do Vendedor	Promoção	Recebido do Marketplace	Preço de Custo	Custo Extra	Imposto	Lucro	Margem (%)
Mercado Livre	SW501	Perfume Deo Colônia Masculino Way Million 15ml Amadeirado	1	R$27,05	R$27,05	R$3,25	R$6,55		R$0,00	R$0,00	R$0,00	R$17,25	R$6,65	R$0,30	R$2,49	R$7,81	28,88%
Mercado Livre	SW305	Perfume Colônia Feminino Olímpia Girl 15ml Oriental Floral	1	R$25,89	R$25,89	R$3,11	R$6,55		R$0,00	R$0,00	R$0,00	R$16,23	R$6,65	R$0,30	R$2,38	R$6,90	26,64%
Mercado Livre	SW304	Perfume Deo Colônia Feminino La Bella Way 15ml Floral	1	R$25,89	R$25,89	R$3,11	R$6,55		R$0,00	R$0,00	R$0,00	R$16,23	R$6,65	R$0,30	R$2,38	R$6,90	26,64%
Mercado Livre	SW501	Perfume Deo Colônia Masculino Way Million 15ml Amadeirado	1	R$27,05	R$27,05	R$3,25	R$6,55	R$9,99	R$0,00	R$0,00	R$0,00	R$17,25	R$6,65	R$0,30	R$2,49	R$7,81	28,88%`;

const values = rawData.split('\n').map(line => line.split('\t'));

let headerRowIndex = 0;
let maxScore = -1;
for (let r = 0; r < Math.min(values.length, 50); r++) {
    const rowArr = values[r] || [];
    const rowStr = rowArr.join(' ').toLowerCase();
    let score = 0;
    if (rowStr.includes('valor') || rowStr.includes('preço') || rowStr.includes('faturamento') || rowStr.includes('recebido')) score++;
    if (rowStr.includes('total')) score++;
    if (rowStr.includes('lucro') || rowStr.includes('líquido') || rowStr.includes('liquido') || rowStr.includes('resultado')) score++;
    if (rowStr.includes('produto') || rowStr.includes('título') || rowStr.includes('nome') || rowStr.includes('descri') || rowStr.includes('item') || rowStr.includes('peça')) score++;
    if (rowStr.includes('data') || rowStr.includes('dia') || rowStr.includes('criado')) score++;
    if (rowStr.includes('origem') || rowStr.includes('canal') || rowStr.includes('loja') || rowStr.includes('market')) score++;
    if (rowStr.includes('qtd') || rowStr.includes('quantidad')) score++;
    if (score > maxScore && score > 0) {
        maxScore = score;
        headerRowIndex = r;
    }
}
const actualHeader = values[headerRowIndex] || [];
console.log('Header row index:', headerRowIndex, 'Max score:', maxScore);

const newSales = [];
for (let i = headerRowIndex + 1; i < values.length; i++) {
    const rowValues = values[i] || [];
    const rowObj = {};
    actualHeader.forEach((h, idx) => {
        if (h && String(h).trim()) rowObj[String(h).trim()] = rowValues[idx];
    });
    
    const hasValue = (k) => {
        const val = rowObj[k];
        return val !== undefined && val !== null && String(val).trim() !== '';
    };

    const getVal = (exactMatches, partialMatches, avoid = []) => {
        const keys = Object.keys(rowObj);
        let key = keys.find(k => exactMatches.some(e => k.toLowerCase() === e.toLowerCase()) && hasValue(k));
        if (key) return rowObj[key];
        key = keys.find(k => {
            const kl = k.toLowerCase();
            if (avoid.some(a => kl.includes(a.toLowerCase()))) return false;
            if (!hasValue(k)) return false;
            return partialMatches.some(p => kl.includes(p.toLowerCase()));
        });
        return key ? rowObj[key] : null;
    };

    const parseCurrency = (val) => {
        if (typeof val === 'number') return val;
        if (!val) return 0;
        let str = String(val).trim();
        let isNegative = false;
        if (str.startsWith('-') || (str.startsWith('(') && str.endsWith(')'))) isNegative = true;
        str = str.replace(/[R$\s%a-zA-Z()\-]/g, '');
        if (str.includes('.') && str.includes(',')) str = str.replace(/\./g, '').replace(',', '.');
        else if (str.includes(',')) str = str.replace(',', '.');
        const num = parseFloat(str) || 0;
        return isNegative ? -num : num;
    };

    let quantityRaw = getVal(['Quantidade', 'Qtd', 'Qtde'], ['quantidad', 'qtd']);
    let parsedQuantity = Number(quantityRaw);
    if (isNaN(parsedQuantity) || parsedQuantity === 0) parsedQuantity = 1;

    const s = {
        marketplace: getVal(['Marketplace', 'Canal', 'Origem', 'Plataforma', 'Loja'], ['marketpla', 'canal', 'origem', 'plataforma', 'loja']) || 'Outros',
        title: getVal(['Título', 'Produto', 'Nome', 'Desc', 'Descrição', 'Item', 'Peça', 'Serviço'], ['título', 'produto', 'nome', 'desc', 'item', 'peça', 'serviço']) || 'Desconhecido',
        quantity: parsedQuantity,
        totalPrice: parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Pago', 'Venda', 'Faturamento', 'Bruto', 'Subtotal'], ['preço tota', 'total', 'valor', 'recebido', 'pago', 'venda', 'faturamento', 'bruto', 'subtotal'], ['taxa', 'frete', 'custo', 'líquido', 'liquido'])),
        profit: parseCurrency(getVal(['Lucro', 'Resultado', 'Lucro Líquido', 'Liquido', 'Líquido', 'Ganho', 'Receita Líquida'], ['lucro', 'resultado', 'liquido', 'ganho'])) || parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Venda', 'Faturamento'], ['preço tota', 'total', 'valor', 'recebido', 'venda', 'faturamento'], ['taxa', 'frete', 'custo', 'líquido', 'liquido']))
    };
    newSales.push(s);
}

console.log('Parsed Sales:', newSales);
