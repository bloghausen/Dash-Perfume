const fs = require('fs');
let code = fs.readFileSync('src/components/MarketplaceLogo.tsx', 'utf8');

code = code.replace("import React, { useState } from 'react';", "import React, { useState } from 'react';\nimport sheinLogo from '../shein.png';");
code = code.replace("const imgSrc = isShein \n       ? '/shein.png' \n       : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;", "const imgSrc = isShein ? sheinLogo : `https://www.google.com/s2/favicons?domain=${domain}&sz=128`;");

fs.writeFileSync('src/components/MarketplaceLogo.tsx', code);
console.log("Patched logo");
