const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetImport = `          const s: SaleRecord = {
            marketplace: getVal(['Marketplace', 'Canal', 'Origem', 'Plataforma', 'Loja'], ['marketpla', 'canal', 'origem', 'plataforma', 'loja']) || 'Outros',
            title: getVal(['Título', 'Produto', 'Nome', 'Desc', 'Descrição', 'Item', 'Peça', 'Serviço'], ['título', 'produto', 'nome', 'desc', 'item', 'peça', 'serviço']) || 'Desconhecido',
            quantity: parsedQuantity,
            totalPrice: parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Pago', 'Venda', 'Faturamento', 'Bruto', 'Subtotal'], ['preço tota', 'total', 'valor', 'recebido', 'pago', 'venda', 'faturamento', 'bruto', 'subtotal'], ['taxa', 'frete', 'custo', 'líquido', 'liquido'])),
            profit: parseCurrency(getVal(['Lucro', 'Resultado', 'Lucro Líquido', 'Liquido', 'Líquido', 'Ganho', 'Receita Líquida'], ['lucro', 'resultado', 'liquido', 'ganho'])) || parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Venda', 'Faturamento'], ['preço tota', 'total', 'valor', 'recebido', 'venda', 'faturamento'], ['taxa', 'frete', 'custo', 'líquido', 'liquido'])),
            month: monthStr
          };

          // Skip completely empty rows
          const isEmptyRow = rowValues.every((v: any) => v === null || v === undefined || String(v).trim() === '');
          if (isEmptyRow) continue;`;

const replacementImport = `          const s: SaleRecord = {
            marketplace: getVal(['Marketplace', 'Canal', 'Origem', 'Plataforma', 'Loja'], ['marketpla', 'canal', 'origem', 'plataforma', 'loja']) || 'Outros',
            title: getVal(['Título', 'Produto', 'Nome', 'Desc', 'Descrição', 'Item', 'Peça', 'Serviço'], ['título', 'produto', 'nome', 'desc', 'item', 'peça', 'serviço']) || 'Desconhecido',
            quantity: parsedQuantity,
            totalPrice: parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Pago', 'Venda', 'Faturamento', 'Bruto', 'Subtotal'], ['preço tota', 'total', 'valor', 'recebido', 'pago', 'venda', 'faturamento', 'bruto', 'subtotal'], ['taxa', 'frete', 'custo', 'líquido', 'liquido'])),
            profit: parseCurrency(getVal(['Lucro', 'Resultado', 'Lucro Líquido', 'Liquido', 'Líquido', 'Ganho', 'Receita Líquida'], ['lucro', 'resultado', 'liquido', 'ganho'])) || parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Venda', 'Faturamento'], ['preço tota', 'total', 'valor', 'recebido', 'venda', 'faturamento'], ['taxa', 'frete', 'custo', 'líquido', 'liquido'])),
            month: monthStr
          };

          // Skip completely empty rows
          const isEmptyRow = rowValues.every((v: any) => v === null || v === undefined || String(v).trim() === '');
          if (isEmptyRow) continue;

          // Skip template row
          const isTemplateRow = s.title.includes('Way Million') && s.quantity === 1 && s.totalPrice < 35 && s.totalPrice > 25;
          if (isTemplateRow) continue;`;

code = code.replace(targetImport, replacementImport);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched importCSV");
