const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const mainDashCode = `
  const fetchMainDashboard = async () => {
    try {
      setIsFetching(true);
      const data = await fetchDashboard('main');
      if (data) {
         setSales(data.sales);
         setAdsSpend(String(data.adsSpend || 0));
         if (data.lastSyncDate) {
             setLastSyncDate(data.lastSyncDate);
         }
         setIsLoaded(true);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsFetching(false);
    }
  };
`;

// Insert after syncPublicData
code = code.replace("const handleImportGoogleSheet = async () => {", mainDashCode + "\n  const handleImportGoogleSheet = async () => {");

// Auto-run on mount if no id and no encoded data
const autoRunCode = `
    } else {
       fetchMainDashboard();
    }
`;
code = code.replace(/} else \{\n\s*\/\/\s*try fetching public sheets automatically\n\s*syncPublicData\(\);\n\s*\}/g, autoRunCode);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx for fetching main");
