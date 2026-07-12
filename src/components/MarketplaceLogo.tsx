import React, { useState } from 'react';
import sheinLogo from '../shein.png';

interface MarketplaceLogoProps {
  name: string;
  className?: string;
}

const getDomainForMarketplace = (name: string) => {
  const q = name.toLowerCase();
  if (q.includes('shopee')) return 'shopee.com';
  if (q.includes('mercadolivre') || q.includes('mercado livre')) return 'mercadolivre.com.br';
  if (q.includes('tiktok')) return 'tiktok.com';
  if (q.includes('temu')) return 'temu.com';
  if (q.includes('shein')) return 'shein.com';
  if (q.includes('amazon')) return 'amazon.com';
  if (q.includes('magalu') || q.includes('magazine luiza')) return 'magazineluiza.com.br';
  if (q.includes('b2w') || q.includes('americanas')) return 'americanas.com.br';
  return null;
};

export const MarketplaceLogo: React.FC<MarketplaceLogoProps> = ({ name, className = "" }) => {
  const [error, setError] = useState(false);
  const domain = getDomainForMarketplace(name);
  const colors = ['#5b42f3', '#ff6b93', '#00d2ff', '#fbbf24', '#a78bfa'];
  
  if (!error && domain) {
    const isShein = domain === 'shein.com';
    const imgSrc = isShein ? sheinLogo : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;
    
    return (
      <img 
        src={imgSrc} 
        alt={name}
        className={`object-cover bg-white ${className} ${isShein ? 'p-1' : ''}`}
        onError={() => setError(true)}
      />
    );
  }

  // Fallback to letters
  const abbr = name.substring(0, 2).toUpperCase();
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const color = colors[hash % colors.length];

  return (
    <div 
      className={`flex items-center justify-center font-[800] text-white ${className}`} 
      style={{ backgroundColor: color }}
    >
      {abbr}
    </div>
  );
};
