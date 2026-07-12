const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

// remove the existing normalizeMarketplace that was incorrectly placed
const existingNormalize = `
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

code = code.replace(existingNormalize, "");

// put it before `export default function App() {`
const newNormalize = `
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

export default function App() {`;

code = code.replace("export default function App() {", newNormalize);

fs.writeFileSync('src/App.tsx', code);
console.log("Moved normalizeMarketplace outside App");
