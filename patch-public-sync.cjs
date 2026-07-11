const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// We will add an automatic sync effect that tries to fetch the sheet publicly.
// First, we need a function to fetch public sheets.
const publicFetchCode = `
  const fetchPublicSheet = async (sheetName: string) => {
    const spreadsheetId = '1GV5jhhjmHIgveGAvvi0xfHJVNDk40Lu4nb4RL2eBuqE';
    const url = \`https://docs.google.com/spreadsheets/d/\${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=\${encodeURIComponent(sheetName)}\`;
    try {
      const res = await fetch(url);
      const text = await res.text();
      if (text.includes('<html') || text.includes('<!DOCTYPE html>')) {
        return null; // Not public or doesn't exist
      }
      return text;
    } catch (e) {
      return null;
    }
  };

  const syncPublicData = async () => {
    setIsFetching(true);
    const mlist = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const tabsToTry = [...mlist, 'ADS'];
    
    let anySuccess = false;
    const newSales: SaleRecord[] = [];
    let newAdsSpend = 0;
    let hasAdsTab = false;

    // Helper to parse CSV line (basic)
    const parseCsvLine = (text: string) => {
       const result = [];
       let current = '';
       let inQuotes = false;
       for (let i = 0; i < text.length; i++) {
          const char = text[i];
          if (char === '"') {
             inQuotes = !inQuotes;
          } else if (char === ',' && !inQuotes) {
             result.push(current);
             current = '';
          } else {
             current += char;
          }
       }
       result.push(current);
       return result.map(s => s.trim().replace(/^"|"$/g, ''));
    };

    for (const tab of tabsToTry) {
      const csvData = await fetchPublicSheet(tab);
      if (csvData) {
        anySuccess = true;
        const lines = csvData.split('\\n').map(line => line.trim()).filter(line => line.length > 0);
        if (lines.length < 2) continue;

        let headerRowIndex = 0;
        let maxScore = -1;
        for (let r = 0; r < Math.min(lines.length, 50); r++) {
           const rowArr = parseCsvLine(lines[r]);
           const rowStr = rowArr.join(' ').toLowerCase();
           let score = 0;
           
           if (tab === 'ADS') {
              if (rowStr.includes('valor') || rowStr.includes('custo') || rowStr.includes('gasto') || rowStr.includes('investimento') || rowStr.includes('total')) score++;
           } else {
              if (rowStr.includes('valor') || rowStr.includes('preço') || rowStr.includes('faturamento') || rowStr.includes('recebido')) score++;
              if (rowStr.includes('total')) score++;
              if (rowStr.includes('lucro') || rowStr.includes('líquido') || rowStr.includes('liquido') || rowStr.includes('resultado')) score++;
              if (rowStr.includes('produto') || rowStr.includes('título') || rowStr.includes('nome') || rowStr.includes('descri') || rowStr.includes('item') || rowStr.includes('peça')) score++;
           }
           
           if (score > maxScore && score > 0) {
              maxScore = score;
              headerRowIndex = r;
           }
        }
        
        if (maxScore === -1) continue; // no header found

        const actualHeader = parseCsvLine(lines[headerRowIndex]);
        
        for (let i = headerRowIndex + 1; i < lines.length; i++) {
           const rowValues = parseCsvLine(lines[i]);
           const rowObj: any = {};
           actualHeader.forEach((h: string, idx: number) => {
              if (h && String(h).trim()) rowObj[String(h).trim()] = rowValues[idx];
           });

           const getVal = (exactMatches: string[], partialMatches: string[], avoid: string[] = []) => {
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

           if (tab === 'ADS') {
             hasAdsTab = true;
             const cost = parseCurrency(getVal(['Valor', 'Custo', 'Gasto', 'Investimento', 'Total'], ['valor', 'custo', 'gasto', 'investimento', 'total']));
             newAdsSpend += cost;
           } else {
             let parsedQuantity = 1;
             let quantityRaw = getVal(['Quantidade', 'Qtd', 'Qtde'], ['quantidad', 'qtd']);
             if (quantityRaw !== null && quantityRaw !== undefined && String(quantityRaw).trim() !== '') {
                parsedQuantity = Number(String(quantityRaw).replace(',', '.'));
                if (isNaN(parsedQuantity)) parsedQuantity = 1;
             }
             if (parsedQuantity === 0) parsedQuantity = 1;

             const s: SaleRecord = {
                marketplace: getVal(['Marketplace', 'Canal', 'Origem', 'Plataforma', 'Loja'], ['marketpla', 'canal', 'origem', 'plataforma', 'loja']) || 'Outros',
                title: getVal(['Título', 'Produto', 'Nome', 'Desc', 'Descrição', 'Item', 'Peça', 'Serviço'], ['título', 'produto', 'nome', 'desc', 'item', 'peça', 'serviço']) || 'Desconhecido',
                quantity: parsedQuantity,
                totalPrice: parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Pago', 'Venda', 'Faturamento', 'Bruto', 'Subtotal'], ['preço tota', 'total', 'valor', 'recebido', 'pago', 'venda', 'faturamento', 'bruto', 'subtotal'], ['taxa', 'frete', 'custo', 'líquido', 'liquido'])),
                profit: parseCurrency(getVal(['Lucro', 'Resultado', 'Lucro Líquido', 'Liquido', 'Líquido', 'Ganho', 'Receita Líquida'], ['lucro', 'resultado', 'liquido', 'ganho'])) || parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Venda', 'Faturamento'], ['preço tota', 'total', 'valor', 'recebido', 'venda', 'faturamento'], ['taxa', 'frete', 'custo', 'líquido', 'liquido'])),
                month: tab
             };

             const isEmptyRow = rowValues.every((v: any) => !v || String(v).trim() === '');
             if (!isEmptyRow) {
                newSales.push(s);
             }
           }
        }
      }
    }

    if (anySuccess) {
       setSales(newSales);
       if (hasAdsTab) setAdsSpend(String(newAdsSpend));
       setLastSyncDate(new Date().toISOString());
       setIsLoaded(true);
    }
    setIsFetching(false);
  };
`;

// Insert the code inside the component
code = code.replace("const handleShare = async () => {", publicFetchCode + "\n\n  const handleShare = async () => {");

// Auto-run on mount if no id and no encoded data
const autoRunCode = `
    } else {
       // try fetching public sheets automatically
       syncPublicData();
    }
`;
code = code.replace("} else {\n       setIsFetching(false);\n    }", autoRunCode);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched!");
