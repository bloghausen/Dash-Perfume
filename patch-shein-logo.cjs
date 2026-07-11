const fs = require('fs');
const file = 'src/components/MarketplaceLogo.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `    const isShein = domain === 'shein.com';
    const imgSrc = isShein 
      ? 'https://play-lh.googleusercontent.com/13i-j2m6eI-hQW3wTleO3Kx7q8x2M_N-N_F2g5tqfA7qfA_7g5tqfA_7qfA' 
      : \`https://www.google.com/s2/favicons?domain=\${domain}&sz=128\`;`;

const replacement = `    const isShein = domain === 'shein.com';
    const imgSrc = isShein 
      ? 'https://play-lh.googleusercontent.com/M_c3ZcQ1dx3AlDSfFEL0S2KgYrmkvJz2gz6gMZaL0pSQS9yYfUOGAQJTfuXMvx0K5c46dh5TKauxuRbUlnxB7w=s128' 
      : \`https://www.google.com/s2/favicons?domain=\${domain}&sz=128\`;`;

code = code.replace(target, replacement);
fs.writeFileSync(file, code);
console.log("Patched shein logo image to actual google play icon!");
