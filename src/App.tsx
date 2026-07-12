import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  Upload, DollarSign, ShoppingBag, TrendingUp, BarChart3, 
  Store, Percent, FileDown, Bell, Home, FileText, Settings, 
  LogOut, Activity, Flame, Target, PieChart as PieChartIcon, Share2, Loader2, Link as LinkIcon,
  Search, ChevronLeft, ChevronRight, RefreshCw, Layers, Compass, HelpCircle
} from 'lucide-react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, ComposedChart, Line, AreaChart, Area 
} from 'recharts';
import * as XLSX from 'xlsx';
import LZString from 'lz-string';
import { createDashboard, fetchDashboard, saveMainDashboard, loginWithGoogle, getAccessToken, auth } from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { MarketplaceLogo } from './components/MarketplaceLogo';

interface SaleRecord {
  marketplace: string;
  title: string;
  quantity: number;
  totalPrice: number;
  profit: number;
  month: string;
}

const COLORS = ['#5b42f3', '#ff6b93', '#00d2ff', '#fbbf24', '#a78bfa'];


const normalizeMarketplace = (val: any) => {
  if (!val) return 'Outros';
  const str = String(val).trim();
  const lower = str.toLowerCase();
  if (lower.includes('temu')) return 'Temu';
  if (lower.includes('shein')) return 'Shein';
  if (lower.includes('mercado livre') || lower.includes('mercadolivre')) return 'Mercado Livre';
  if (lower.includes('tiktok')) return 'TikTok Shop';
  if (lower.includes('shopee')) return 'Shopee';
  if (lower.includes('amazon')) return 'Amazon';
  return str.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};

export default function App() {
  const [adsSpend, setAdsSpend] = useState<string>('');
  const [selectedMonth, setSelectedMonth] = useState<string>('Todos');
  const [sales, setSales] = useState<SaleRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [sharedLink, setSharedLink] = useState('');
  const [user, setUser] = useState<any>(null);
  const [lastSyncDate, setLastSyncDate] = useState<string>('');
  const [activeTab, setActiveTab] = useState<string>('home');
  const isReadonly = useMemo(() => new URLSearchParams(window.location.search).get('readonly') === 'true', []);
  const [salesSearch, setSalesSearch] = useState<string>('');
  const [salesFilterMarketplace, setSalesFilterMarketplace] = useState<string>('Todos');
  const [salesPage, setSalesPage] = useState<number>(0);
  const [productSearch, setProductSearch] = useState<string>('');
  
  // GSheet state
  const [isImportingGSheet, setIsImportingGSheet] = useState(false);

  // Custom alerts and non-blocking toast notifications
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);
  const [confirmModal, setConfirmModal] = useState<{ message: string; onConfirm: () => void } | null>(null);
  const [infoModal, setInfoModal] = useState<{ title: string; message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    // Keep it readable and vanish state
    setTimeout(() => {
      setToast(prev => prev?.message === message ? null : prev);
    }, 4500);
  };
  


  const months = ['Todos', 'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => setUser(u));
    return unsub;
  }, []);

  useEffect(() => {
    const searchParams = new URLSearchParams(window.location.search);
    const id = searchParams.get('id');
    let encodedData = searchParams.get('d');
    
    if (encodedData) {
       encodedData = encodedData.replace(/ /g, '+');
       try {
          const decoded = JSON.parse(LZString.decompressFromEncodedURIComponent(encodedData) || "{}");
          if (decoded.sales) {
             setSales(decoded.sales);
             setAdsSpend(String(decoded.adsSpend || 0));
             if (decoded.lastSyncDate) {
                 setLastSyncDate(decoded.lastSyncDate);
             }
             setIsLoaded(true);
          }
       } catch (e) {
          console.error("Failed to parse embedded data", e);
       }
       setIsFetching(false);
    } else if (id) {
       fetchDashboard(id).then(data => {
         
      if (data && data.sales && data.sales.length > 0) {

            setSales(data.sales);
            setAdsSpend(String(data.adsSpend));
            setIsLoaded(true);
         }
         setIsFetching(false);
       });
    
    
    } else {
       fetchMainDashboard();
    }


  }, []);

  
  const fetchPublicSheet = async (sheetName: string) => {
    const spreadsheetId = '1GV5jhhjmHIgveGAvvi0xfHJVNDk40Lu4nb4RL2eBuqE';
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
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

  
  const parseCurrency = (val: any) => {
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
       if (str.match(/,\d{2}$/) || str.match(/,\d$/)) {
          str = str.replace(',', '.');
       } else {
          str = str.replace(/,/g, '');
       }
    } else if (str.includes('.')) {
       if (str.match(/^\d{1,3}\.\d{3}$/) || str.match(/^\d{1,3}(\.\d{3})+$/)) {
          str = str.replace(/\./g, '');
       }
    }
    const num = parseFloat(str) || 0;
    return isNegative ? -num : num;
  };

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
        const lines = csvData.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        if (tab === 'ADS') {
           hasAdsTab = true;
           const headerRow = parseCsvLine(lines[0] || "");
           let costColIndex = -1;
           for (let c = 0; c < headerRow.length; c++) {
              const h = String(headerRow[c]).toLowerCase();
              if (h.includes('custo') || h.includes('valor') || h.includes('gasto') || h.includes('investimento') || h.includes('ads')) {
                 costColIndex = c; break;
              }
           }
           let cost = 0;
           // If we have a second line, try parsing from there
           if (lines.length >= 2) {
              const row2 = parseCsvLine(lines[1] || "");
              if (costColIndex >= 0 && row2.length > costColIndex) {
                 cost = parseCurrency(row2[costColIndex]);
              } else if (row2.length >= 2) {
                 cost = parseCurrency(row2[1]); // col B
              } else if (row2.length >= 1) {
                 cost = parseCurrency(row2[0]);
              }
              if (!cost) {
                 for (let c = 0; c < row2.length; c++) {
                    const val = parseCurrency(row2[c]);
                    if (val > 0) { cost = val; break; }
                 }
              }
           }
           
           // If cost is still 0 (e.g. single row), scan the first row
           if (!cost) {
              for (let c = 0; c < headerRow.length; c++) {
                 const val = parseCurrency(headerRow[c]);
                 if (val > 0) { cost = val; break; }
              }
           }
           
           newAdsSpend += cost;
           continue;
        }


        let headerRowIndex = 0;
        let maxScore = -1;
        for (let r = 0; r < Math.min(lines.length, 50); r++) {
           const rowArr = parseCsvLine(lines[r]);
           const rowStr = rowArr.join(' ').toLowerCase();
           let score = 0;
           
           
          
           if (rowStr.includes('valor') || rowStr.includes('preço') || rowStr.includes('faturamento') || rowStr.includes('recebido')) score++;
           if (rowStr.includes('total')) score++;
           if (rowStr.includes('lucro') || rowStr.includes('líquido') || rowStr.includes('liquido') || rowStr.includes('resultado')) score++;
           if (rowStr.includes('produto') || rowStr.includes('título') || rowStr.includes('nome') || rowStr.includes('descri') || rowStr.includes('item') || rowStr.includes('peça')) score++;
           
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

             let parsedQuantity = 1;
             let quantityRaw = getVal(['Quantidade', 'Qtd', 'Qtde'], ['quantidad', 'qtd']);
             if (quantityRaw !== null && quantityRaw !== undefined && String(quantityRaw).trim() !== '') {
                parsedQuantity = Number(String(quantityRaw).replace(',', '.'));
                if (isNaN(parsedQuantity)) parsedQuantity = 1;
             }
             if (parsedQuantity === 0) parsedQuantity = 1;

             const s: SaleRecord = {
                marketplace: normalizeMarketplace(getVal(['Marketplace', 'Canal', 'Origem', 'Plataforma', 'Loja'], ['marketpla', 'canal', 'origem', 'plataforma', 'loja'])),
                title: getVal(['Título', 'Produto', 'Nome', 'Desc', 'Descrição', 'Item', 'Peça', 'Serviço'], ['título', 'produto', 'nome', 'desc', 'item', 'peça', 'serviço']) || 'Desconhecido',
                quantity: parsedQuantity,
                totalPrice: parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Pago', 'Venda', 'Faturamento', 'Bruto', 'Subtotal'], ['preço tota', 'total', 'valor', 'recebido', 'pago', 'venda', 'faturamento', 'bruto', 'subtotal'], ['taxa', 'frete', 'custo', 'líquido', 'liquido'])),
                profit: parseCurrency(getVal(['Lucro', 'Resultado', 'Lucro Líquido', 'Liquido', 'Líquido', 'Ganho', 'Receita Líquida'], ['lucro', 'resultado', 'liquido', 'ganho'])) || parseCurrency(getVal(['Preço Total', 'Total', 'Valor', 'Valor Total', 'Valor Recebido', 'Recebido', 'Venda', 'Faturamento'], ['preço tota', 'total', 'valor', 'recebido', 'venda', 'faturamento'], ['taxa', 'frete', 'custo', 'líquido', 'liquido'])),
                month: tab
             };

             const isEmptyRow = rowValues.every((v: any) => !v || String(v).trim() === '');
             const isTemplateRow = s.title.includes('Way Million') && s.quantity === 1 && s.totalPrice < 35 && s.totalPrice > 25;
             
             if (!isEmptyRow && !isTemplateRow) {
                newSales.push(s);
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


  const handleShare = async () => {
    setIsSaving(true);
    try {
      const url = new URL(window.location.href);
      url.searchParams.delete('id'); // Remove id parameter as we don't use DB
      
      const compressedData = LZString.compressToEncodedURIComponent(JSON.stringify({ sales, adsSpend, lastSyncDate }));
      url.searchParams.set('d', compressedData);
      url.searchParams.set('readonly', 'true');
      
      let linkUrl = url.toString();
      // Troca o ambiente de dev para pre (publicado) para permitir incorporação no Google Sites
      linkUrl = linkUrl.replace('ais-dev-', 'ais-pre-');
      
      setSharedLink(linkUrl);
      showToast('Link de compartilhamento online gerado com sucesso!', 'success');
    } catch (e: any) {
      console.error(e);
      setInfoModal({
        title: "Erro ao Compartilhar",
        message: "Não foi possível gerar o link de compartilhamento.",
        type: 'error'
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut();
      showToast('Sessão encerrada com sucesso!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Erro ao sair da conta.', 'error');
    }
  };

  
  const fetchMainDashboard = async () => {
    try {
      setIsFetching(true);
      
      // Timeout de 3 segundos para não travar a tela
      const data = await Promise.race([
        fetchDashboard('main'),
        new Promise<null>(resolve => setTimeout(() => resolve(null), 3000))
      ]);

      if (data) {
         setSales(data.sales);
         setAdsSpend(String(data.adsSpend || 0));
         if (data.lastSyncDate) {
             setLastSyncDate(data.lastSyncDate);
         }
         setIsLoaded(true);
      } else {
         // Fallback to public sheet if db is empty or failed
         syncPublicData();
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  };

  const handleImportGoogleSheet = async () => {

  const parseCurrency = (val: any) => {
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
       if (str.match(/,\d{2}$/) || str.match(/,\d$/)) {
          str = str.replace(',', '.');
       } else {
          str = str.replace(/,/g, '');
       }
    } else if (str.includes('.')) {
       if (str.match(/^\d{1,3}\.\d{3}$/) || str.match(/^\d{1,3}(\.\d{3})+$/)) {
          str = str.replace(/\./g, '');
       }
    }
    const num = parseFloat(str) || 0;
    return isNegative ? -num : num;
  };

    const spreadsheetId = '1GV5jhhjmHIgveGAvvi0xfHJVNDk40Lu4nb4RL2eBuqE';

    setIsImportingGSheet(true);
    try {
      let token = await getAccessToken();
      if (!user || !token) {
        await loginWithGoogle();
        token = await getAccessToken();
      }
      
      if (!token) {
        throw new Error("Não foi possível obter o token de acesso. Tente fazer login novamente.");
      }

      // Step 1: Get Google Sheets metadata (tabs)
      const resMeta = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}`, {
         headers: { Authorization: `Bearer ${token}` }
      });

      if (!resMeta.ok) {
        let errorMsg = '';
        try { 
          const errData = await resMeta.json();
          errorMsg = errData?.error?.message || errData?.error?.status || '';
        } catch(e) {}
        
        if (errorMsg.includes('has not been used in project') || errorMsg.includes('API is disabled')) {
           throw new Error('A API do Google Sheets não está ativada no seu projeto do Firebase. Acesse o Google Cloud Console do seu projeto Firebase e ative a "Google Sheets API".');
        }

        if (errorMsg.includes('not be an Office file') || errorMsg.includes('Office file')) {
           throw new Error('O arquivo está no formato Excel (.xlsx) no Google Drive. Por favor, abra o arquivo no Google Sheets, clique em "Arquivo" > "Salvar como Google Sheets" e cole o novo link gerado aqui.');
        }

        if (resMeta.status === 403 || resMeta.status === 404) {
          throw new Error(`Acesso negado ou planilha não encontrada (${resMeta.status}). A aba atual está logada em uma conta do Google que não tem permissão de leitura para esta planilha. Detalhes: ${errorMsg}`);
        }
        throw new Error(`Erro ao carregar a planilha (Status ${resMeta.status}). ${errorMsg}`);
      }

      const meta = await resMeta.json();
      const sheetNames = meta.sheets.map((s: any) => s.properties.title);

      if (sheetNames.length === 0) throw new Error('Nenhuma aba encontrada na planilha.');

      const mlist = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      
      // Extract month from document title as fallback
      let docMonth = 'Desconhecido';
      if (meta.properties && meta.properties.title) {
         const docTitle = meta.properties.title.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
         const matchedDoc = mlist.find((mo, idx) => {
             const moNorm = mo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
             const numStr = String(idx + 1).padStart(2, '0');
             return docTitle.includes(moNorm) || 
                    docTitle.includes(moNorm.substring(0,3)) ||
                    docTitle.includes('/' + numStr + '/') ||
                    docTitle.includes('-' + numStr + '-') ||
                    docTitle.endsWith('/' + numStr) ||
                    docTitle.endsWith('-' + numStr) ||
                    docTitle.startsWith(numStr + '/') ||
                    docTitle.startsWith(numStr + '-');
         });
         if (matchedDoc) docMonth = matchedDoc;
      }

      // Step 2: Fetch data from all tabs
      const ranges = sheetNames.map((n: string) => `ranges=${encodeURIComponent("'" + n + "'")}`).join('&');
      const resData = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchGet?valueRenderOption=UNFORMATTED_VALUE&${ranges}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!resData.ok) {
        let errorMsg = '';
        try { 
          const errData = await resData.json();
          errorMsg = errData?.error?.message || errData?.error?.status || '';
        } catch(e) {}
        throw new Error(`Erro ao baixar os dados da planilha. Tente novamente. Detalhes: ${errorMsg}`);
      }

      const data = await resData.json();

      
      
      
      
      const newSales: SaleRecord[] = [];
      let newAdsSpend = 0;
      let hasAdsTab = false;


      data.valueRanges.forEach((vr: any) => {
        const titleMatch = vr.range.match(/^'?(.+?)'?!(.+)$/);
        const title = titleMatch ? titleMatch[1] : vr.range;
        const values = vr.values || [];
        let defaultMonth = typeof docMonth !== 'undefined' ? docMonth : 'Desconhecido';
        const normalizedTitle = title.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        
        if (normalizedTitle === 'ads') {
          hasAdsTab = true;
          const headerRow = values[0] || [];
          let costColIndex = -1;
          for (let c = 0; c < headerRow.length; c++) {
             const h = String(headerRow[c]).toLowerCase();
             if (h.includes('custo') || h.includes('valor') || h.includes('gasto') || h.includes('investimento') || h.includes('ads')) {
                costColIndex = c; break;
             }
          }
          
          let cost = 0;
          if (values.length >= 2) {
              const row2 = values[1] || [];
              if (costColIndex >= 0 && row2.length > costColIndex) {
                 cost = parseCurrency(row2[costColIndex]);
              } else if (row2.length >= 2) {
                 cost = parseCurrency(row2[1]); // col B
              } else if (row2.length >= 1) {
                 cost = parseCurrency(row2[0]);
              }
              if (!cost) {
                 for (let c = 0; c < row2.length; c++) {
                    const val = parseCurrency(row2[c]);
                    if (val > 0) { cost = val; break; }
                 }
              }
          }
          
          if (!cost) {
              for (let c = 0; c < headerRow.length; c++) {
                 const val = parseCurrency(headerRow[c]);
                 if (val > 0) { cost = val; break; }
              }
          }
          newAdsSpend += cost;
          return;
        }

        if (values.length < 2) return; // Need header and at least one row
        const header = values[0];

        if (!normalizedTitle.includes('pagina') && !normalizedTitle.includes('sheet') && !normalizedTitle.includes('planilha')) {
            const matchedTab = mlist.find((mo, idx) => {
               const moNorm = mo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
               const numStr = String(idx + 1).padStart(2, '0');
               return normalizedTitle === moNorm || 
                      normalizedTitle.includes(moNorm.substring(0,3)) ||
                      normalizedTitle.includes('/' + numStr + '/') ||
                      normalizedTitle.includes('-' + numStr + '-') ||
                      normalizedTitle.endsWith('/' + numStr) ||
                      normalizedTitle.endsWith('-' + numStr) ||
                      normalizedTitle.startsWith(numStr + '/') ||
                      normalizedTitle.startsWith(numStr + '-') ||
                      normalizedTitle === numStr;
            });
            if (matchedTab) defaultMonth = matchedTab;
        }

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

        for (let i = headerRowIndex + 1; i < values.length; i++) {
           const rowValues = values[i] || [];
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

          
          let monthStr = defaultMonth;
          if (defaultMonth === 'Desconhecido' || defaultMonth === 'Todos') {
             const m = getVal(['Mês', 'Mes', 'Month'], ['mês', 'mes', 'month']);
             const d = getVal(['Data', 'Criado', 'Date', 'Dia'], ['data', 'criado', 'date', 'dia']);

             if (m !== null && m !== undefined) {
                const parsedM = parseInt(String(m));
                if (!isNaN(parsedM) && parsedM >= 1 && parsedM <= 12) {
                    monthStr = mlist[parsedM - 1];
                } else {
                    const matched = mlist.find(mo => mo.toLowerCase() === String(m).trim().toLowerCase() || String(m).trim().toLowerCase().startsWith(mo.toLowerCase().substring(0,3)));
                    if (matched) monthStr = matched;
                    else monthStr = String(m).trim();
                }
             } else if (d !== null && d !== undefined) {
                const strDate = String(d).trim();
                let parsed = false;
                if (strDate.includes('/')) {
                   const parts = strDate.split('/');
                   if (parts.length >= 2) {
                      const monthPart = parseInt(parts[1]);
                      if (!isNaN(monthPart) && monthPart >= 1 && monthPart <= 12) {
                         monthStr = mlist[monthPart - 1];
                         parsed = true;
                      }
                   }
                } else if (strDate.includes('-')) {
                   const parts = strDate.split('-');
                   if (parts.length >= 2) {
                      const monthPart = parseInt(parts[1]);
                      if (!isNaN(monthPart) && monthPart >= 1 && monthPart <= 12) {
                         monthStr = mlist[monthPart - 1];
                         parsed = true;
                      }
                   }
                }
                
                if (!parsed) {
                   // Check for Google Sheets serial date (number of days since Dec 30, 1899)
                   if (!isNaN(Number(strDate)) && Number(strDate) > 20000 && Number(strDate) < 70000) {
                      const dObj = new Date(Date.UTC(1899, 11, 30) + Number(strDate) * 86400000);
                      monthStr = mlist[dObj.getUTCMonth()];
                   } else {
                      const dObj = new Date(strDate);
                      if (!isNaN(dObj.getTime())) monthStr = mlist[dObj.getUTCMonth()];
                   }
                }
             }
          }

          let quantityRaw = getVal(['Quantidade', 'Qtd', 'Qtde'], ['quantidad', 'qtd']);
          let parsedQuantity = 1;
          if (quantityRaw !== null && quantityRaw !== undefined && String(quantityRaw).trim() !== '') {
             parsedQuantity = Number(String(quantityRaw).replace(',', '.'));
             if (isNaN(parsedQuantity)) parsedQuantity = 1;
          }
          if (parsedQuantity === 0) {
             parsedQuantity = 1;
          }

          const s: SaleRecord = {
            marketplace: normalizeMarketplace(getVal(['Marketplace', 'Canal', 'Origem', 'Plataforma', 'Loja'], ['marketpla', 'canal', 'origem', 'plataforma', 'loja'])),
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
          if (isTemplateRow) continue;

          // Skip total/summary rows
          const isTotalRow = rowValues.slice(0, 3).some((v: any) => {
              const str = String(v).trim().toLowerCase();
              return str === 'total' || str === 'totais' || str === 'resultado' || str === 'soma';
          });
          if (isTotalRow) continue;

          newSales.push(s);
        }
      });
      
      let driveModifiedTime = new Date().toISOString();
      try {
        const resDrive = await fetch(`https://www.googleapis.com/drive/v3/files/${spreadsheetId}?fields=modifiedTime`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (resDrive.ok) {
           const driveData = await resDrive.json();
           if (driveData.modifiedTime) {
             driveModifiedTime = driveData.modifiedTime;
           }
        }
      } catch (e) {}

      setLastSyncDate(driveModifiedTime);
      setSales(newSales);
      if (hasAdsTab) setAdsSpend(String(newAdsSpend));
      saveMainDashboard(newSales, hasAdsTab ? newAdsSpend : (Number(adsSpend) || 0), driveModifiedTime);
      setIsLoaded(true);
      showToast(`Dados importados do Google Sheets com sucesso! ${newSales.length} registros puxados.`, 'success');
    } catch (err: any) {
       console.error("GSheets Error", err);
       showToast(err.message || 'Houve um erro ao importar dados do Google Sheets.', 'error');
    } finally {
       setIsImportingGSheet(false);
    }
  };

  const { receita, vendas, ticketMedio, lucroBruto, marketplaceData, productData, monthlyData } = useMemo(() => {
    let rec = 0;
    let vend = 0;
    let lucro = 0;
    const mktMap: Record<string, number> = {};
    const prodMap: Record<string, number> = {};
    const monthMap: Record<string, { receita: number, lucro: number, quantidade: number }> = {};
    
    const mlist = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    sales.forEach(s => {
       const isTemplateRow = s.title.includes('Way Million') && s.quantity === 1 && s.totalPrice < 35 && s.totalPrice > 25;
       if (isTemplateRow) return;

       if (!monthMap[s.month]) monthMap[s.month] = { receita: 0, lucro: 0, quantidade: 0 };
       monthMap[s.month].receita += s.totalPrice;
       monthMap[s.month].lucro += s.profit;
       monthMap[s.month].quantidade += s.quantity;
    });

    const filteredSales = selectedMonth === 'Todos' ? sales : sales.filter(s => {
        return s.month.toLowerCase() === selectedMonth.toLowerCase() ||
               s.month.toLowerCase().includes(selectedMonth.toLowerCase()) ||
               selectedMonth.toLowerCase().includes(s.month.toLowerCase());
    });

    filteredSales.forEach(s => {
      const isTemplateRow = s.title.includes('Way Million') && s.quantity === 1 && s.totalPrice < 35 && s.totalPrice > 25;
      if (isTemplateRow) return;
      rec += s.totalPrice;
      vend += s.quantity;
      lucro += s.profit;

            // normalize for old data
      const mkt = normalizeMarketplace(s.marketplace);
      mktMap[mkt] = (mktMap[mkt] || 0) + s.totalPrice;
      prodMap[s.title] = (prodMap[s.title] || 0) + s.totalPrice;
    });

    const mktData = Object.entries(mktMap)
      .map(([name, rel]) => ({ name, rel }))
      .sort((a, b) => b.rel - a.rel);

    const prodData = Object.entries(prodMap)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 15);
      
    const monthlyChartDataAll = mlist.map(m => {
       const data = monthMap[m] || { receita: 0, lucro: 0, quantidade: 0 };
       return { name: m, ...data };
    });
    
    let lastIndex = -1;
    for (let i = monthlyChartDataAll.length - 1; i >= 0; i--) {
        if (monthlyChartDataAll[i].receita > 50 || monthlyChartDataAll[i].quantidade > 1) {
            lastIndex = i;
            break;
        }
    }
    
    const monthlyChartData = lastIndex >= 0 ? monthlyChartDataAll.slice(0, lastIndex + 1) : [];

    return {
      receita: rec,
      vendas: vend,
      ticketMedio: vend > 0 ? rec / vend : 0,
      lucroBruto: lucro,
      marketplaceData: mktData,
      productData: prodData,
      monthlyData: monthlyChartData
    };
  }, [sales, selectedMonth]);

  const adsNumber = Number(adsSpend) || 0;
  const lucroLiquido = lucroBruto - adsNumber;
  const margemLiquida = receita > 0 ? (lucroLiquido / receita) * 100 : 0;

  const filteredAndPaginatedSales = useMemo(() => {
    let list = sales;
    if (salesFilterMarketplace !== 'Todos') {
      list = list.filter(item => item.marketplace.toLowerCase() === salesFilterMarketplace.toLowerCase());
    }
    if (salesSearch.trim()) {
      const q = salesSearch.toLowerCase();
      list = list.filter(item => 
        item.title.toLowerCase().includes(q) || 
        item.marketplace.toLowerCase().includes(q) ||
        item.month.toLowerCase().includes(q)
      );
    }
    const pageSize = 50;
    const totalPages = Math.ceil(list.length / pageSize);
    const currentPage = Math.min(salesPage, Math.max(0, totalPages - 1));
    const paginated = list.slice(currentPage * pageSize, (currentPage + 1) * pageSize);
    return {
      records: paginated,
      totalCount: list.length,
      totalPages,
      currentPage
    };
  }, [sales, salesSearch, salesFilterMarketplace, salesPage]);

  const uniqueMarketplaces = useMemo(() => {
    const s = new Set(sales.map(item => item.marketplace));
    return ['Todos', ...Array.from(s)];
  }, [sales]);

  const productLeaderboard = useMemo(() => {
    const prodMap: Record<string, { name: string, receita: number, quantidade: number, lucro: number }> = {};
    sales.forEach(s => {
      if (!prodMap[s.title]) {
        prodMap[s.title] = { name: s.title, receita: 0, quantidade: 0, lucro: 0 };
      }
      prodMap[s.title].receita += s.totalPrice;
      prodMap[s.title].quantidade += s.quantity;
      prodMap[s.title].lucro += s.profit;
    });
    return Object.values(prodMap).sort((a, b) => b.receita - a.receita);
  }, [sales]);

  const filteredProductLeaderboard = useMemo(() => {
    let list = productLeaderboard;
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      list = list.filter(item => item.name.toLowerCase().includes(q));
    }
    return list;
  }, [productLeaderboard, productSearch]);

  if (isFetching) {
     return (
        <div className="flex bg-[#e2e8f0] w-full min-h-screen items-center justify-center font-sans">
           <Loader2 className="w-10 h-10 animate-spin text-[#5b42f3]" />
        </div>
     );
  }

  return (
    <div className="flex bg-[#e2e8f0] w-full min-h-screen p-4 min-[1400px]:p-6 gap-6 font-sans text-slate-800">
      
      {/* SIDEBAR LEFT */}
      {!isReadonly && (
      <nav className="w-24 bg-[#5b42f3] rounded-[2.5rem] flex flex-col items-center py-8 shadow-2xl shrink-0 h-[calc(100vh-32px)] overflow-y-auto">
        <div 
          onClick={() => showToast(`Sincronização Ativa: ${user ? (user.isAnonymous ? "Conectado como Convidado" : `Conectado como ${user.email}`) : "Demonstração Offline"}`, 'info')} 
          className="text-white/60 mb-10 hover:text-white cursor-pointer transition-colors p-3 bg-white/10 rounded-full"
          title="Status de Sincronização"
        >
          <Bell className="w-6 h-6 animate-pulse" />
        </div>
        
        <div className="flex flex-col gap-6 w-full items-center flex-1">
          <button 
            onClick={() => setActiveTab('home')}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${activeTab === 'home' ? 'bg-white shadow-lg shadow-indigo-900/20 text-[#5b42f3]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
            title="Dashboard Principal"
          >
            <Home className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setActiveTab('sales')}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${activeTab === 'sales' ? 'bg-white shadow-lg shadow-indigo-900/20 text-[#5b42f3]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
            title="Tabela de Vendas"
          >
            <FileText className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setActiveTab('charts')}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${activeTab === 'charts' ? 'bg-white shadow-lg shadow-indigo-900/20 text-[#5b42f3]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
            title="Gráficos & Análises"
          >
            <BarChart3 className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setActiveTab('products')}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${activeTab === 'products' ? 'bg-white shadow-lg shadow-indigo-900/20 text-[#5b42f3]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
            title="Ranking de Produtos"
          >
            <PieChartIcon className="w-6 h-6" />
          </button>
          
          <button 
            onClick={() => setActiveTab('settings')}
            className={`p-4 rounded-2xl cursor-pointer transition-all duration-300 ${activeTab === 'settings' ? 'bg-white shadow-lg shadow-indigo-900/20 text-[#5b42f3]' : 'text-white/50 hover:text-white hover:bg-white/10'}`}
            title="Configurações & Guia"
          >
            <Settings className="w-6 h-6" />
          </button>
        </div>

        <button 
          onClick={handleLogout}
          className="text-white/50 hover:text-white mt-auto cursor-pointer transition-colors p-4 rounded-2xl hover:bg-red-500/20 hover:text-red-200"
          title="Sair"
        >
          <LogOut className="w-6 h-6" />
        </button>
      </nav>
      )}

      {/* MAIN LAYOUT */}
      <div className="flex-1 flex flex-col xl:flex-row gap-6 min-w-0">
        
        {/* CENTER COLUMN (DASHBOARD CONTENT) */}
        <main className="flex-1 flex flex-col min-w-0 pr-2 pb-8 h-[calc(100vh-32px)] overflow-y-auto">
          
          {/* HEADER */}
          <header className="flex flex-col sm:flex-row justify-between sm:items-end mb-8 pt-2 gap-4">
            <div>
              <p className="text-sm font-bold text-slate-400 mb-1 tracking-wider uppercase">
                {activeTab === 'home' && "Métricas em Tempo Real"}
                {activeTab === 'sales' && "Planilha Sincronizada"}
                {activeTab === 'charts' && "Visão Analítica"}
                {activeTab === 'products' && "Inventário & Rankings"}
                {activeTab === 'settings' && "Configurações Gerais"}
              </p>
              <h1 className="text-4xl font-[800] text-slate-800 capitalize">
                {activeTab === 'home' && "Dashboard"}
                {activeTab === 'sales' && "Tabela de Vendas"}
                {activeTab === 'charts' && "Gráficos & Análises"}
                {activeTab === 'products' && "Ranking de Produtos"}
                {activeTab === 'settings' && "Configurações & Guia"}
              </h1>
              {lastSyncDate && (
                <div className="flex items-center gap-1.5 mt-2 text-slate-400 font-semibold text-xs">
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Sincronizado em {new Date(lastSyncDate).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                </div>
              )}
            </div>
            
            {!isReadonly && (
            <div className="flex gap-4 items-center bg-white p-2 pl-4 rounded-full shadow-sm">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-slate-400" />
                <input 
                  type="number" 
                  value={adsSpend} 
                  onChange={e => setAdsSpend(e.target.value)} 
                  placeholder="Custo Ads"
                  className="bg-transparent outline-none w-24 text-sm font-semibold text-slate-700"
                />
              </div>
              
              <button 
                onClick={handleImportGoogleSheet}
                disabled={isImportingGSheet}
                className="bg-emerald-500 p-2.5 rounded-full text-white shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition-colors disabled:opacity-50"
                title="Sincronizar Planilha"
              >
                {isImportingGSheet ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              </button>
              
              <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-sm shrink-0">
                <img src={user?.photoURL || "https://ui-avatars.com/api/?name=User&background=e2e8f0&color=5b42f3"} alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
            )}
          </header>

          {sharedLink && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in" style={{ animationDuration: '0.2s' }}>
              <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-2xl flex flex-col items-center text-center">
                <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                  <Share2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-[800] text-slate-800 mb-2">Link Gerado com Sucesso!</h3>
                <p className="text-slate-500 mb-4 font-medium">Copie o link abaixo e envie para quem desejar compartilhar este dashboard. Eles terão acesso instantâneo aos seus dados de vendas.</p>

                <div className="bg-amber-50 text-amber-800 text-xs font-semibold p-3 rounded-xl mb-8 flex items-start text-left">
                  <span className="mr-2">⚠️</span>
                  <span><strong>Aviso:</strong> Este link é um link de visualização restrito (Preview) e exige permissões de acesso. <strong>Não é possível incorporá-lo (embed) diretamente no Google Sites ou painéis externos</strong> devido à segurança de login da plataforma (que bloqueia iframes).</span>
                </div>
                
                <div className="w-full relative mb-8">
                  <div className="w-full bg-slate-50 border-2 border-slate-200 text-slate-600 p-4 rounded-xl font-mono text-sm break-all pr-32 select-all overflow-hidden text-left shadow-inner h-20 overflow-y-auto">
                    {sharedLink}
                  </div>
                  <button 
                    onClick={() => { 
                      try {
                        navigator.clipboard.writeText(sharedLink); 
                        showToast('Link copiado para a área de transferência!', 'success'); 
                      } catch {
                        showToast('Erro ao copiar link automaticamente. Por favor, marque o link e copie MANUALMENTE.', 'error');
                      }
                    }} 
                    className="absolute right-2 top-2 bottom-2 bg-[#5b42f3] text-white px-4 rounded-lg text-sm font-bold shadow-md hover:bg-indigo-600 transition flex items-center justify-center gap-2"
                  >
                    <LinkIcon className="w-4 h-4" /> Copiar
                  </button>
                </div>

                <div className="w-full flex gap-3">
                  <button onClick={() => setSharedLink('')} className="flex-1 border-2 border-slate-200 text-slate-600 px-6 py-3 rounded-xl font-bold hover:bg-slate-50 transition">
                    Fechar
                  </button>
                  <a href={sharedLink} target="_blank" rel="noopener noreferrer" onClick={() => setSharedLink('')} className="flex-1 bg-slate-800 text-white px-6 py-3 rounded-xl font-bold hover:bg-slate-900 transition flex justify-center items-center">
                    Testar Link
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* EMPTY STATES & VIEW SELECTION */}
          {!isLoaded && activeTab !== 'settings' ? (
            <div className="flex-1 flex flex-col items-center justify-center bg-white/30 backdrop-blur-md rounded-[3rem] p-8 text-center" style={{ boxShadow: 'inset 0 0 0 2px rgba(255,255,255,1)' }}>
              <div className="w-24 h-24 bg-white rounded-[2rem] flex items-center justify-center mb-6 shadow-xl shadow-slate-200/50 rotate-[-10deg]">
                <FileDown className="w-10 h-10 text-[#5b42f3]" />
              </div>
              <h3 className="text-3xl font-[800] text-slate-800 mb-3">Sincronize seus Dados</h3>
              <p className="text-slate-500 max-w-md font-medium mb-8">
                Clique no botão abaixo para puxar as informações recentes da sua planilha fixa do Google Sheets e liberar todas as telas do seu painel e compartilhar online.
              </p>
              
              <div className="flex flex-col gap-4 items-center justify-center w-full max-w-2xl mt-4">
                <button 
                  onClick={handleImportGoogleSheet}
                  disabled={isImportingGSheet}
                  className="w-full sm:w-auto bg-emerald-500 p-4 px-8 rounded-full text-white font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-600 transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {isImportingGSheet ? <Loader2 className="w-5 h-5 animate-spin" /> : <LinkIcon className="w-5 h-5" />}
                  Sincronizar Planilha
                </button>

                {!user && (
                   <button 
                     onClick={() => loginWithGoogle().catch(e => {
                       console.error(e);
                       showToast('Erro no login. Caso utilize Safari/Iframe, tente abrir em nova aba!', 'error');
                     })} 
                     className="w-full sm:w-auto bg-white text-slate-800 border-2 border-slate-200 font-bold p-3.5 px-6 rounded-full hover:bg-slate-50 transition shadow-sm"
                   >
                     Entrar com Google
                   </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/********* HOME TAB *********/}
              {activeTab === 'home' && (
                <div className="animate-fade-in duration-200">
                  {/* TOP CARDS ROW */}
                  <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6 mb-8">
                    
                    {/* WIDE CARD: OVERVIEW */}
                    <div className="bg-gradient-to-br from-[#5b42f3] to-[#452ab5] rounded-[2.5rem] p-8 text-white relative overflow-hidden group shadow-[0_20px_50px_-15px_rgba(91,66,243,0.5)]">
                      <div className="absolute -top-32 -right-32 w-96 h-96 bg-white/10 rounded-full blur-3xl pointer-events-none"></div>
                      
                      <div className="flex justify-between items-start mb-6 relative z-10">
                        <h3 className="text-xl font-bold opacity-90">Overview</h3>
                        <div className="bg-white/20 backdrop-blur-md rounded-full px-5 py-2 flex items-center gap-3">
                          <select 
                            value={selectedMonth} 
                            onChange={(e) => setSelectedMonth(e.target.value)}
                            className="bg-transparent text-white text-sm outline-none appearance-none font-bold cursor-pointer"
                          >
                            {['Todos', ...monthlyData.map(m => m.name)].map(m => (
                              <option key={m} value={m} className="text-slate-800">{m}</option>
                            ))}
                          </select>
                          
                          {!new URLSearchParams(window.location.search).get('id') && !isReadonly && (
                            <button 
                              onClick={handleShare}
                              disabled={isSaving}
                              className="ml-2 pl-3 border-l border-white/20 flex items-center gap-2 text-white hover:text-white/80 transition disabled:opacity-50"
                            >
                               {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                               <span className="text-xs font-bold uppercase tracking-wider">{user ? 'Compartilhar' : 'Login p/ Compartilhar'}</span>
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="h-56 w-full relative z-10 mb-8">
                        <ResponsiveContainer width="100%" height="100%">
                          <ComposedChart data={monthlyData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorReceita" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#fff" stopOpacity={0.25}/>
                                <stop offset="95%" stopColor="#fff" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }} dy={10} />
                            <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: 600 }} dx={-10} tickFormatter={v => `${v/1000}k`} />
                            <YAxis yAxisId="right" orientation="right" hide />
                            <Tooltip 
                              contentStyle={{ backgroundColor: 'white', borderRadius: '1.5rem', border: 'none', color: '#1e293b', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)', padding: '12px 20px' }}
                              itemStyle={{ fontWeight: 'bold' }}
                              cursor={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 2, strokeDasharray: '5 5' }}
                              formatter={(value, name) => {
                                if (name === 'Receita') return ['R$ ' + Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}), name];
                                return [value, name];
                              }}
                            />
                            <Area yAxisId="left" type="monotone" dataKey="receita" stroke="none" fill="url(#colorReceita)" />
                            <Line yAxisId="left" type="monotone" dataKey="receita" stroke="#ffffff" strokeWidth={4} dot={{ r: 6, fill: '#5b42f3', strokeWidth: 3, stroke: '#fff' }} activeDot={{ r: 8, fill: '#fff' }} name="Receita" />
                            <Line yAxisId="right" type="monotone" dataKey="quantidade" stroke="#ff6b93" strokeWidth={4} dot={false} activeDot={{ r: 6 }} name="Vendas (Qtd)" opacity={0.6}/>
                          </ComposedChart>
                        </ResponsiveContainer>
                      </div>

                      <div className="grid grid-cols-2 gap-6 relative z-10">
                        <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-5">
                          <div className="text-white/70 text-xs font-bold mb-1 tracking-wider">RECEITA TOTAL</div>
                          <div className="font-[800] text-3xl">
                            {receita.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-md rounded-[1.5rem] p-5">
                          <div className="text-white/70 text-xs font-bold mb-1 tracking-wider">LUCRO BRUTO</div>
                          <div className="font-[800] text-3xl">
                            {lucroBruto.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* RIGHT CARDS STACK */}
                    <div className="flex flex-col gap-6">
                      {/* UNIDADES */}
                      <div className="bg-[#7b62f2] rounded-[2.5rem] p-8 text-white flex-1 shadow-[0_15px_30px_-10px_rgba(123,98,242,0.4)] relative overflow-hidden flex flex-col justify-center">
                        <div className="absolute top-4 right-4 text-white/20">
                          <ShoppingBag className="w-24 h-24" />
                        </div>
                        <div className="relative z-10 flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-[1rem] bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <ShoppingBag className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-bold">Unidades</h4>
                        </div>
                        <div className="relative z-10">
                          <div className="text-sm font-semibold opacity-90 mb-1">Totalização de Vendas</div>
                          <div className="text-4xl font-[800]">{vendas} <span className="text-xl font-bold opacity-80">un</span></div>
                        </div>
                      </div>

                      {/* LUCRO LIQUIDO */}
                      <div className="bg-[#ff6b93] rounded-[2.5rem] p-8 text-white flex-1 shadow-[0_15px_30px_-10px_rgba(255,107,147,0.4)] relative overflow-hidden flex flex-col justify-center">
                         <div className="absolute -bottom-6 -right-6 text-white/20 transform rotate-12">
                          <Flame className="w-32 h-32" />
                        </div>
                        <div className="relative z-10 flex items-center gap-3 mb-6">
                          <div className="w-10 h-10 rounded-[1rem] bg-white/20 backdrop-blur-md flex items-center justify-center">
                            <Flame className="w-5 h-5 text-white" />
                          </div>
                          <h4 className="text-lg font-bold">Lucro Liq.</h4>
                        </div>
                        <div className="relative z-10">
                          <div className="text-sm font-semibold opacity-90 mb-1">Deduzindo Custo Ads</div>
                          <div className="text-4xl font-[800]">
                            <span className="text-2xl mr-1 opacity-80">R$</span>
                            {lucroLiquido.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BOTTOM WHITE CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-6 mt-12 mb-6">
                    
                    {/* TICKET MEDIO */}
                    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.1)] flex flex-col pt-12 relative text-center">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#5b42f3] rounded-[1.2rem] flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(91,66,243,0.4)] rotate-[-5deg]">
                        <Target className="w-7 h-7 rotate-[5deg]" />
                      </div>
                      <h4 className="text-slate-800 font-bold text-xl mb-1">Ticket Médio</h4>
                      <p className="text-slate-400 text-sm font-semibold">Valor por compra</p>
                      
                      <div className="mt-8 mb-4">
                        <span className="text-3xl font-[800] text-slate-800">
                          R$ {ticketMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </span>
                      </div>

                      <div className="w-full flex items-center justify-between text-xs font-bold mt-4">
                        <span className="text-slate-400">Qualidade</span>
                        <span className="text-emerald-500">Excelente</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-emerald-400 w-[85%] rounded-full"></div>
                      </div>
                    </div>

                    {/* MARGEM LIQUIDA */}
                    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.1)] flex flex-col pt-12 relative text-center">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#5b42f3] rounded-[1.2rem] flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(91,66,243,0.4)] rotate-[5deg]">
                         <Activity className="w-7 h-7 rotate-[-5deg]" />
                      </div>
                      <h4 className="text-slate-800 font-bold text-xl mb-1">Margem Real</h4>
                      <p className="text-slate-400 text-sm font-semibold">Receita vs Lucro Líq.</p>
                      
                      <div className="mt-8 mb-4">
                        <span className={`text-3xl font-[800] ${margemLiquida >= 0 ? 'text-slate-800' : 'text-red-500'}`}>
                           {margemLiquida.toFixed(1)}%
                        </span>
                      </div>

                      <div className="w-full flex items-center justify-between text-xs font-bold mt-4">
                        <span className="text-slate-400">Saúde</span>
                        <span className={margemLiquida >= 20 ? 'text-[#5b42f3]' : margemLiquida >= 0 ? 'text-emerald-500' : 'text-red-500'}>
                          {margemLiquida >= 20 ? 'Ótima' : margemLiquida >= 0 ? 'Boa' : 'Atenção'}
                        </span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className={`h-full rounded-full ${margemLiquida >= 20 ? 'bg-[#5b42f3]' : margemLiquida >= 0 ? 'bg-emerald-400' : 'bg-red-400'}`} style={{ width: `${Math.min(Math.max(margemLiquida, 10), 100)}%` }}></div>
                      </div>
                    </div>

                    {/* ADS SPEND */}
                    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-[0_15px_40px_-20px_rgba(0,0,0,0.1)] flex flex-col pt-12 relative text-center">
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 w-16 h-16 bg-[#5b42f3] rounded-[1.2rem] flex items-center justify-center text-white shadow-[0_10px_20px_-5px_rgba(91,66,243,0.4)] rotate-[-5deg]">
                         <DollarSign className="w-7 h-7 rotate-[5deg]" />
                      </div>
                      <h4 className="text-slate-800 font-bold text-xl mb-1">Despesas ADS</h4>
                      <p className="text-slate-400 text-sm font-semibold">Investimento Geral</p>
                      
                      <div className="mt-8 mb-4">
                        <span className="text-3xl font-[800] text-slate-800">
                          R$ {adsNumber.toLocaleString('pt-BR', { minimumFractionDigits: 0 })}
                        </span>
                      </div>

                      <div className="w-full flex items-center justify-between text-xs font-bold mt-4">
                        <span className="text-slate-400">ROAS</span>
                        <span className="text-[#ff6b93]">{adsNumber > 0 ? (receita/adsNumber).toFixed(1) : '∞'}x</span>
                      </div>
                      <div className="w-full h-2 bg-slate-100 rounded-full mt-2 overflow-hidden">
                        <div className="h-full bg-[#ff6b93] w-[60%] rounded-full"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/********* SALES TAB *********/}
              {activeTab === 'sales' && (
                <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm flex flex-col min-h-[480px] animate-fade-in duration-200">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-bold text-slate-800">Registros de Vendas Importadas</h3>
                      <p className="text-sm text-slate-400 font-medium">Visualização de todos os registros mapeados no Excel</p>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
                      {/* Search box */}
                      <div className="relative flex-1 sm:w-64 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400 shrink-0" />
                        <input 
                          type="text" 
                          placeholder="Buscar por produto..." 
                          value={salesSearch} 
                          onChange={e => { setSalesSearch(e.target.value); setSalesPage(0); }}
                          className="bg-transparent text-sm w-full outline-none text-slate-700 font-semibold"
                        />
                      </div>
                      
                      {/* Dropdown filters */}
                      <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-1.5">
                        <span className="text-xs font-extrabold text-slate-400">Origem:</span>
                        <select 
                          value={salesFilterMarketplace} 
                          onChange={e => { setSalesFilterMarketplace(e.target.value); setSalesPage(0); }}
                          className="bg-transparent text-xs font-bold text-slate-700 outline-none cursor-pointer"
                        >
                          {uniqueMarketplaces.map(mkt => (
                            <option key={mkt} value={mkt}>{mkt}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="overflow-x-auto -mx-6 lg:-mx-8">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold tracking-wider uppercase">
                          <th className="px-6 lg:px-8 py-4">Canal</th>
                          <th className="px-6 lg:px-8 py-4">Produto</th>
                          <th className="px-6 lg:px-8 py-4 text-center">Mês</th>
                          <th className="px-6 lg:px-8 py-4 text-center">Quantidade</th>
                          <th className="px-6 lg:px-8 py-4 text-right">Preço Total</th>
                          <th className="px-6 lg:px-8 py-4 text-right">Lucro Bruto</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-700">
                        {filteredAndPaginatedSales.records.map((sale, i) => (
                          <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-6 lg:px-8 py-3.5">
                              <span className="px-2.5 py-1 text-xs font-extrabold bg-[#5b42f3]/10 text-[#5b42f3] rounded-lg">
                                {sale.marketplace}
                              </span>
                            </td>
                            <td className="px-6 lg:px-8 py-3.5 max-w-xs truncate" title={sale.title}>{sale.title}</td>
                            <td className="px-6 lg:px-8 py-3.5 text-center text-xs font-bold text-slate-400">{sale.month}</td>
                            <td className="px-6 lg:px-8 py-3.5 text-center font-bold text-slate-800">{sale.quantity}</td>
                            <td className="px-6 lg:px-8 py-3.5 text-right font-extrabold text-slate-800">R$ {sale.totalPrice.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                            <td className={`px-6 lg:px-8 py-3.5 text-right font-extrabold ${sale.profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                              R$ {sale.profit.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                            </td>
                          </tr>
                        ))}
                        {filteredAndPaginatedSales.records.length === 0 && (
                          <tr>
                            <td colSpan={6} className="text-center py-12 text-slate-400 font-semibold">
                              Nenhum registro encontrado correspondente aos filtros de busca.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Paginated actions */}
                  {filteredAndPaginatedSales.totalPages > 1 && (
                    <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-auto">
                      <span className="text-xs font-bold text-slate-400">
                        Mostrando {filteredAndPaginatedSales.records.length} de {filteredAndPaginatedSales.totalCount} registros
                      </span>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => setSalesPage(p => Math.max(0, p - 1))}
                          disabled={filteredAndPaginatedSales.currentPage === 0}
                          className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <span className="text-sm font-bold text-slate-600 px-3">
                          Página {filteredAndPaginatedSales.currentPage + 1} de {filteredAndPaginatedSales.totalPages}
                        </span>
                        <button 
                          onClick={() => setSalesPage(p => Math.min(filteredAndPaginatedSales.totalPages - 1, p + 1))}
                          disabled={filteredAndPaginatedSales.currentPage === filteredAndPaginatedSales.totalPages - 1}
                          className="w-10 h-10 border border-slate-200 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-50 disabled:opacity-40 transition-colors cursor-pointer"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/********* CHARTS TAB *********/}
              {activeTab === 'charts' && (
                <div className="space-y-6 animate-fade-in duration-200">
                  {/* CHART CARDS */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm">
                      <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Média de Faturamento / Mês</h4>
                      <div className="text-2xl font-[800] text-[#5b42f3]">
                        R$ {(monthlyData.length > 0 ? receita / monthlyData.length : 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-[2rem] shadow-sm">
                      <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Média de Lucro / Mês</h4>
                      <div className="text-2xl font-[800] text-emerald-500">
                        R$ {(monthlyData.length > 0 ? lucroBruto / monthlyData.length : 0).toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
                      </div>
                    </div>

                    <div className="bg-white p-6 rounded-[2rem] shadow-sm">
                      <h4 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Canais Sincronizados</h4>
                      <div className="text-2xl font-[800] text-[#ff6b93]">
                        {marketplaceData.length} Canais Ativos
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                    
                    
                    {/* Monthly Comparison */}
                    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 font-display">Faturamento vs Lucro por Mês (R$)</h3>
                      <div className="h-72">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={monthlyData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} tickFormatter={v => `R$ ${v/1000}k`} />
                            <Tooltip formatter={(value: any) => `R$ ${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
                            <Bar dataKey="receita" fill="#5b42f3" name="Faturamento" radius={[4, 4, 0, 0]} />
                            <Bar dataKey="lucro" fill="#10b981" name="Lucro Bruto" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Channels pie */}
                    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 font-display">Distribuição de Receita por Canal (%)</h3>
                      <div className="h-72 flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="w-full md:w-1/2 h-full">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie 
                                data={marketplaceData} 
                                dataKey="rel" 
                                nameKey="name" 
                                cx="50%" 
                                cy="50%" 
                                innerRadius={60} 
                                outerRadius={80} 
                                paddingAngle={5}
                              >
                                {marketplaceData.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip formatter={(value: any) => `R$ ${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}`} />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                        
                        <div className="space-y-3 w-full md:w-1/2">
                          {marketplaceData.map((m, index) => (
                            <div key={m.name} className="flex items-center gap-3">
                              <span className="w-3.5 h-3.5 rounded-full shrink-0" style={{ backgroundColor: COLORS[index % COLORS.length] }}></span>
                              <span className="text-xs font-bold text-slate-500 truncate max-w-[124px]">{m.name}</span>
                              <span className="ml-auto text-xs font-extrabold text-[#5b42f3]">
                                {receita > 0 ? `${((m.rel / receita) * 100).toFixed(1)}%` : '0%'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Volume Evolution */}
                    <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm col-span-full">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 font-display">Quantidade Mensal de Produtos Vendidos (Unidades)</h3>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={monthlyData}>
                            <defs>
                              <linearGradient id="colorUnidades" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#ff6b93" stopOpacity={0.2}/>
                                <stop offset="95%" stopColor="#ff6b93" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12, fontWeight: 600 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94a3b8', fontSize: 12 }} />
                            <Tooltip formatter={(value, name) => [value, name]} />
                            <Area type="monotone" dataKey="quantidade" stroke="#ff6b93" strokeWidth={3} fillOpacity={1} fill="url(#colorUnidades)" name="Unidades Vendidas" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/********* PRODUCTS TAB *********/}
              {activeTab === 'products' && (
                <div className="space-y-6 animate-fade-in duration-200">
                  <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                      <div>
                        <h3 className="text-xl font-bold text-slate-800">Ranking de Faturamento de Produtos</h3>
                        <p className="text-sm text-slate-400 font-medium">Classificação ordenada por desempenho comercial</p>
                      </div>
                      
                      <div className="relative w-full md:w-80 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2 flex items-center gap-2">
                        <Search className="w-4 h-4 text-slate-400 shrink-0" />
                        <input 
                          type="text" 
                          placeholder="Buscar produto no ranking..." 
                          value={productSearch} 
                          onChange={e => setProductSearch(e.target.value)}
                          className="bg-transparent text-sm w-full outline-none text-slate-700 font-semibold"
                        />
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead>
                          <tr className="border-b border-slate-100 text-slate-400 text-xs font-bold tracking-wider uppercase">
                            <th className="py-4 pl-4 text-center">Rank</th>
                            <th className="py-4 pl-4">Nome do Produto</th>
                            <th className="py-4 text-center">Unidades</th>
                            <th className="py-4 text-right">Preço Médio Unitário</th>
                            <th className="py-4 text-right">Faturamento Bruto</th>
                            <th className="py-4 text-right">Margem Lucro bruto</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 text-sm font-semibold text-slate-700">
                          {filteredProductLeaderboard.slice(0, 30).map((prod, i) => {
                            const precoMedio = prod.quantidade > 0 ? prod.receita / prod.quantidade : 0;
                            const margemPorc = prod.receita > 0 ? (prod.lucro / prod.receita) * 100 : 0;
                            return (
                              <tr key={i} className="hover:bg-slate-50/50 transition-colors">
                                <td className="py-4 pl-4 font-extrabold text-slate-400 text-center w-16">
                                  {i < 3 ? (
                                    <span className={`inline-flex w-7 h-7 rounded-full items-center justify-center text-xs text-white font-black ${i === 0 ? 'bg-amber-400' : i === 1 ? 'bg-slate-400' : 'bg-amber-600'}`}>
                                      {i + 1}
                                    </span>
                                  ) : i + 1}
                                </td>
                                <td className="py-4 max-w-sm truncate text-slate-800 font-bold" title={prod.name}>{prod.name}</td>
                                <td className="py-4 text-center font-bold text-slate-600">{prod.quantidade}</td>
                                <td className="py-4 text-right text-slate-500">R$ {precoMedio.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="py-4 text-right font-extrabold text-[#5b42f3]">R$ {prod.receita.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                                <td className="py-4 text-right">
                                  <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${margemPorc >= 40 ? 'bg-emerald-50 text-emerald-600' : 'bg-indigo-50 text-indigo-600'}`}>
                                    {margemPorc.toFixed(1)}%
                                  </span>
                                </td>
                              </tr>
                            );
                          })}
                          {filteredProductLeaderboard.length === 0 && (
                            <tr>
                              <td colSpan={6} className="text-center py-12 text-slate-400 font-semibold">
                                Nenhum produto corresponde aos filtros de busca informados.
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/********* SETTINGS TAB *********/}
          {activeTab === 'settings' && (
            <div className="space-y-6 animate-fade-in duration-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Credentials & user */}
                <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm">
                  <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                     <Layers className="w-5 h-5 text-[#5b42f3]" /> Status de Usuário & Sincronização
                  </h3>
                  <p className="text-sm text-slate-400 font-medium mb-6">Controle as opções de salvamento online do seu painel</p>
                  
                  <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-6">
                    {user && !user.isAnonymous ? (
                      <div className="flex items-center gap-4">
                        <img src={user.photoURL || "https://ui-avatars.com/api/?name=User"} alt="Avatar" className="w-16 h-16 rounded-full border-2 border-white shadow-sm" />
                        <div>
                          <h4 className="font-bold text-slate-800 text-lg">{user.displayName || "Usuário Sincronizado"}</h4>
                          <p className="text-sm text-slate-400 font-medium">{user.email}</p>
                          <span className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                            Conectado via Google Auth
                          </span>
                        </div>
                      </div>
                    ) : user && user.isAnonymous ? (
                      <div className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-full bg-indigo-50 text-[#5b42f3] border-2 border-indigo-200 flex items-center justify-center font-bold text-xl uppercase">
                          C
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-slate-800 text-lg">Acesso Rápido (Convidado)</h4>
                          <p className="text-sm text-slate-400 font-medium">Link compartilhado sem login de e-mail</p>
                          <div className="flex flex-wrap gap-2 mt-2">
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-50 text-indigo-600 border border-indigo-100">
                              Sessão Ativa
                            </span>
                            <button 
                              onClick={() => loginWithGoogle().catch(e => {
                                console.error(e);
                                showToast('Não foi possível alternar, abra em nova aba!', 'error');
                              })}
                              className="text-xs font-bold text-[#5b42f3] underline hover:text-indigo-800 transition"
                            >
                              Vincular Conta Google
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-sm font-semibold text-slate-500 mb-4">Você está acessando em modo demonstração local.</p>
                        <button 
                          onClick={() => loginWithGoogle().catch(e => {
                            console.error(e);
                            showToast('Ative os pop-ups ou abra em nova aba para logar com o Google!', 'error');
                          })}
                          className="bg-[#5b42f3] text-white font-extrabold px-6 py-2.5 rounded-full hover:bg-indigo-600 transition text-sm shadow-md cursor-pointer"
                        >
                          Fazer Login com Google
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="space-y-3">
                     <label className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block block mb-1">Investimento ADS Médio (R$)</label>
                     <div className="flex gap-3">
                        <input 
                          type="number" 
                          placeholder="Ex: 500" 
                          value={adsSpend}
                          onChange={e => setAdsSpend(e.target.value)}
                          className="bg-slate-50 border border-slate-200 rounded-xl p-3 outline-none flex-1 font-bold text-slate-700 font-semibold"
                        />
                     </div>
                  </div>
                </div>

                {/* Clear options / instructions */}
                <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                       <HelpCircle className="w-5 h-5 text-[#ff6b93]" /> Limpar Dados & Reiniciar
                    </h3>
                    <p className="text-sm text-slate-400 font-medium mb-6">Remova as planilhas carregadas atualmente para reiniciar do zero ou carregar outro arquivo</p>
                  </div>

                  <div className="bg-red-50/50 border border-red-100 rounded-2xl p-6 mb-6">
                    <p className="text-xs font-semibold text-red-600 leading-relaxed font-sans">
                      CUIDADO: Esta ação removerá permanentemente todos os registros de vendas da sua visualização e retornará à tela de importação inicial.
                    </p>
                  </div>

                  <button 
                    onClick={() => {
                      setConfirmModal({
                        message: "Deseja realmente apagar todos os dados importados? Esta ação removerá permanentemente os gráficos, tabelas e dados calculados.",
                        onConfirm: () => {
                          setSales([]);
                          setAdsSpend('');
                          setSharedLink('');
                          setIsLoaded(false);
                          setActiveTab('home');
                          showToast("Dados removidos com sucesso!", 'success');
                          setConfirmModal(null);
                        }
                      });
                    }}
                    className="w-full bg-red-600 text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition shadow-sm cursor-pointer"
                  >
                     Limpar Todos os Dados
                  </button>
                </div>
              </div>

              {/* Template format guidelines */}
              <div className="bg-white rounded-[2rem] p-6 lg:p-8 shadow-sm">
                <h3 className="text-lg font-bold text-slate-800 mb-2 flex items-center gap-2">
                  <Compass className="w-5 h-5 text-emerald-500" /> Guia de Formatação de Planilhas Excel
                </h3>
                <p className="text-sm text-slate-400 font-medium mb-6 font-semibold">Para máxima precisão na conversão do dashboard, formate as colunas da sua planilha usando uma das palavras-chave mapeadas abaixo:</p>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-800 block mb-2">Canal / Marketplace</span>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed font-semibold">Detectado em abas do excel ou colunas com termos: <strong className="text-slate-700 font-extrabold">Marketplace, Canal, Origem</strong>.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-800 block mb-2">Título do produto</span>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed font-semibold">Nome descritivo detectado por cabeçalhos contendo: <strong className="text-slate-700 font-extrabold">Título, Produto, Nome, Descrição</strong>.</p>
                  </div>

                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <span className="text-sm font-bold text-slate-800 block mb-2">Quantidade e Preços</span>
                    <p className="text-xs text-slate-500 font-medium leading-relaxed font-semibold">Detecta números e moedas automáticas em: <strong className="text-slate-700 font-extrabold">Qtd, Quantidade, Valor, Preço, Lucro, Resultado</strong>.</p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
        
        {/* RIGHT SIDEBAR (Always there if screen size permits on Home Tab) */}
        {isLoaded && activeTab === 'home' && (
          <aside className="w-full xl:w-[22rem] bg-white rounded-[3rem] p-8 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.05)] shrink-0 flex flex-col gap-10 h-fit xl:h-[calc(100vh-32px)] overflow-y-auto">
            
            {/* Marketplaces */}
            <div>
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                  <Store className="w-5 h-5 text-[#5b42f3]" /> Canais
                </h3>
                {!isReadonly && <button className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-800 transition-colors" onClick={() => setActiveTab('sales')}>Ver Todos</button>}
              </div>
              
              <div className="flex bg-slate-50 rounded-full p-1.5 mb-8">
                <div className="flex-1 text-center py-2 bg-[#5b42f3] rounded-full text-xs font-bold text-white shadow-lg shadow-indigo-200 cursor-pointer">Receita</div>
                <button className="flex-1 text-center py-2 text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => !isReadonly && setActiveTab('sales')}>Volume</button>
              </div>

              <div className="space-y-6">
                {marketplaceData.map((m, i) => (
                  <div key={m.name} className="flex items-center gap-4">
                    <div className="relative">
                      <MarketplaceLogo 
                        name={m.name} 
                        className="w-12 h-12 rounded-[1rem] shadow-sm text-base" 
                      />
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-bold text-slate-800 truncate">{m.name}</div>
                      <div className="text-xs text-slate-400 font-semibold mt-0.5">R$ {m.rel.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                    </div>
                    {!isReadonly && (
                      <button className="w-10 h-10 rounded-[1rem] bg-slate-50 flex items-center justify-center border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors text-slate-400 hover:text-[#5b42f3]" onClick={() => setActiveTab('charts')}>
                         <BarChart3 className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Top 5 list (Live Map Style) */}
            <div className="pt-6 border-t border-slate-100">
               <div className="flex justify-between items-center mb-6">
                 <h3 className="font-bold text-xl text-slate-800 flex items-center gap-2">
                    <PieChartIcon className="w-5 h-5 text-[#ff6b93]" /> Produtos
                 </h3>
                 {!isReadonly && <button className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-800 transition-colors" onClick={() => setActiveTab('products')}>Ver Todos</button>}
               </div>
               
               <div className="space-y-5">
                 {productData.map((item, i) => (
                   <div key={item.name} className="flex items-center justify-between text-sm group">
                      <div className="flex items-center gap-4 overflow-hidden">
                         <div className="w-10 h-10 rounded-full flex items-center justify-center shadow-sm shrink-0" style={{ backgroundColor: COLORS[i % COLORS.length] + '20' }}>
                           <ShoppingBag className="w-5 h-5" style={{ color: COLORS[i % COLORS.length] }} />
                         </div>
                         <div className="flex flex-col truncate">
                           <span className="text-slate-800 font-bold truncate max-w-[140px]" title={item.name}>{item.name}</span>
                           <span className="text-slate-400 text-xs font-semibold mt-0.5">Rank #{i+1}</span>
                         </div>
                      </div>
                      <span className="text-[#5b42f3] font-[800] whitespace-nowrap ml-2">
                         R$ {(item.value/1000).toFixed(1)}k
                      </span>
                   </div>
                 ))}
               </div>
            </div>

          </aside>
        )}

      </div>

      {/* CUSTOM NON-BLOCKING TOAST NOTIFICATIONS */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[120] max-w-sm bg-slate-900/95 backdrop-blur-md text-white px-5 py-3.5 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700/50 transition-all duration-300">
          <div className={`w-3 h-3 rounded-full shrink-0 ${
            toast.type === 'success' ? 'bg-emerald-400' : 
            toast.type === 'error' ? 'bg-rose-500' : 'bg-indigo-400'
          }`} />
          <p className="text-xs font-bold leading-normal">{toast.message}</p>
          <button 
            onClick={() => setToast(null)} 
            className="ml-auto text-white/50 hover:text-white font-black text-xs pl-2 shrink-0 transition"
          >
            ✕
          </button>
        </div>
      )}

      {/* CUSTOM COHESIVE CONFIRMATION DIALOG */}
      {confirmModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center border border-slate-100">
            <div className="w-16 h-16 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center mb-6 shadow-inner rotate-3">
              <HelpCircle className="w-8 h-8 rotate-[-3deg]" />
            </div>
            <h3 className="text-2xl font-[800] text-slate-800 mb-2 font-display">Confirmar Remoção</h3>
            <p className="text-slate-500 mb-8 font-semibold leading-relaxed text-sm">{confirmModal.message}</p>
            <div className="w-full flex gap-3">
              <button 
                onClick={() => setConfirmModal(null)} 
                className="flex-1 border-2 border-slate-100 text-slate-500 px-6 py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition cursor-pointer text-sm"
              >
                Cancelar
              </button>
              <button 
                onClick={confirmModal.onConfirm} 
                className="flex-1 bg-red-500 text-white px-6 py-3.5 rounded-2xl font-bold hover:bg-red-600 transition shadow-lg shadow-red-200 text-sm cursor-pointer"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      )}

      {infoModal && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl flex flex-col items-center text-center border border-slate-100">
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md ${
              infoModal.type === 'error' ? 'bg-red-50 text-red-500' : 'bg-indigo-50 text-[#5b42f3]'
            }`}>
              <HelpCircle className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-[800] text-slate-800 mb-2">{infoModal.title}</h3>
            <p className="text-slate-400 mb-8 font-semibold leading-relaxed text-xs">{infoModal.message}</p>
            
            <div className="w-full flex flex-col gap-3">
              <a 
                href={window.location.origin + window.location.pathname + (window.location.search || '')} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-full bg-[#5b42f3] text-white px-6 py-3.5 rounded-2xl font-bold text-center hover:bg-indigo-600 transition shadow-lg shadow-indigo-100 flex items-center justify-center gap-2 text-sm"
              >
                Abrir em Nova Aba ↗
              </a>
              <button 
                onClick={() => setInfoModal(null)} 
                className="w-full border-2 border-slate-150 text-slate-500 px-6 py-1 rounded-2xl font-bold hover:bg-slate-100 transition text-sm cursor-pointer"
              >
                Voltar ao Painel
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
