const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const normalizeMktFunc = `
const normalizeMarketplace = (val: any) => {
  if (!val) return 'Outros';
  const str = String(val).trim();
  const lower = str.toLowerCase();
  if (lower === 'temu') return 'Temu';
  if (lower === 'shein') return 'Shein';
  if (lower.includes('mercado livre') || lower.includes('mercadolivre')) return 'Mercado Livre';
  if (lower.includes('tiktok')) return 'TikTok Shop';
  if (lower === 'shopee') return 'Shopee';
  if (lower === 'amazon') return 'Amazon';
  return str.split(' ').map((w: string) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
};
`;

code = code.replace("const parseCurrency = (val: any) => {", normalizeMktFunc + "\n  const parseCurrency = (val: any) => {");

const targetImport = `marketplace: getVal(['Marketplace', 'Canal', 'Origem', 'Plataforma', 'Loja'], ['marketpla', 'canal', 'origem', 'plataforma', 'loja']) || 'Outros',`;
const replacementImport = `marketplace: normalizeMarketplace(getVal(['Marketplace', 'Canal', 'Origem', 'Plataforma', 'Loja'], ['marketpla', 'canal', 'origem', 'plataforma', 'loja'])),`;

// It occurs in importCSV and syncPublicData, replace globally
code = code.split(targetImport).join(replacementImport);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched normalizeMarketplace");
