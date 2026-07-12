const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `
  if (lower === 'temu') return 'Temu';
  if (lower === 'shein') return 'Shein';
  if (lower.includes('mercado livre') || lower.includes('mercadolivre')) return 'Mercado Livre';
  if (lower.includes('tiktok')) return 'TikTok Shop';
  if (lower === 'shopee') return 'Shopee';
  if (lower === 'amazon') return 'Amazon';
`;

const replacement = `
  if (lower.includes('temu')) return 'Temu';
  if (lower.includes('shein')) return 'Shein';
  if (lower.includes('mercado livre') || lower.includes('mercadolivre')) return 'Mercado Livre';
  if (lower.includes('tiktok')) return 'TikTok Shop';
  if (lower.includes('shopee')) return 'Shopee';
  if (lower.includes('amazon')) return 'Amazon';
`;

code = code.replace(target, replacement);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched normalizeMarketplace with includes");
