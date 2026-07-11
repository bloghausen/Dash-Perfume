const headers = ['Marketplace', 'SKU Externo', 'Título', 'Quantidade', 'Preço Unitário', 'Preço Total', 'Comissão', 'Taxa de Envio', 'Frete recebido', 'Taxa de Serviço', 'Cupom do Vendedor', 'Promoção', 'Recebido do Marketplace', 'Preço de Custo', 'Custo Extra', 'Imposto', 'Lucro', 'Margem (%)'];
const rowValues = ['Mercado Livre', 'SW501', 'Perfume Deo Colônia Masculino Way Million 15ml Amadeirado', '3', 'R$27,05', 'R$80,94', 'R$9,72', 'R$19,66', '', 'R$0,00', 'R$0,00', 'R$0,00', 'R$51,56', 'R$19,95', 'R$0,90', 'R$5,42', 'R$25,29', '31,24%'];

const rowObj = {};
headers.forEach((h, idx) => {
    if (h && String(h).trim()) rowObj[String(h).trim()] = rowValues[idx];
});

const getVal = (exactMatches, partialMatches, avoid = []) => {
    const keys = Object.keys(rowObj);
    let key = keys.find(k => exactMatches.some(e => k.toLowerCase() === e.toLowerCase()));
    if (key) return rowObj[key];
    
    key = keys.find(k => {
        const kl = k.toLowerCase();
        if (avoid.some(a => kl.includes(a.toLowerCase()))) return false;
        return partialMatches.some(p => kl.includes(p.toLowerCase()));
    });
    return key ? rowObj[key] : null;
};

const parseCurrency = (val) => {
    if (typeof val === 'number') return val;
    if (!val) return 0;
    let str = String(val).trim();
    let isNegative = false;
    if (str.includes('-') || (str.includes('(') && str.includes(')'))) {
        isNegative = true;
    }
    str = str.replace(/[R$\s]/g, '');
    if (str.match(/\d+\.\d{3},\d{2}/) || str.match(/\d+,\d{2}$/)) {
        str = str.replace(/\./g, '').replace(',', '.');
    } else if (str.match(/\d+,\d+$/)) {
        str = str.replace(',', '.');
    }
    const num = parseFloat(str) || 0;
    return isNegative ? -num : num;
};

let quantityRaw = getVal(['Quantidade', 'Qtd', 'Qtde'], ['quantidad', 'qtd']);
let parsedQuantity = 1;
if (quantityRaw !== null && quantityRaw !== undefined && String(quantityRaw).trim() !== '') {
    parsedQuantity = Number(String(quantityRaw).replace(',', '.'));
    if (isNaN(parsedQuantity)) parsedQuantity = 1;
}

const s = {
    marketplace: getVal(['Marketplace', 'Canal', 'Origem', 'Plataforma', 'Loja'], ['marketpla', 'canal', 'origem', 'plataforma', 'loja']) || 'Outros',
    title: getVal(['Título', 'Produto', 'Nome', 'Desc', 'Descrição', 'Item', 'Peça', 'Serviço'], ['título', 'produto', 'nome', 'desc', 'item', 'peça', 'serviço']) || 'Desconhecido',
    quantity: parsedQuantity,
    totalPrice: parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Pago', 'Venda', 'Faturamento', 'Bruto', 'Subtotal'], ['preço tota', 'total', 'valor', 'recebido', 'pago', 'venda', 'faturamento', 'bruto', 'subtotal'], ['taxa', 'frete', 'custo', 'líquido', 'liquido'])),
    profit: parseCurrency(getVal(['Lucro', 'Resultado', 'Lucro Líquido', 'Liquido', 'Líquido', 'Ganho', 'Receita Líquida'], ['lucro', 'resultado', 'liquido', 'ganho'])) || parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Venda', 'Faturamento'], ['preço tota', 'total', 'valor', 'recebido', 'venda', 'faturamento'], ['taxa', 'frete', 'custo', 'líquido', 'liquido']))
};
console.log(s);
