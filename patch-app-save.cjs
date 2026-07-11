const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace("fetchDashboard,", "fetchDashboard, saveMainDashboard,");

code = code.replace(
  "setLastSyncDate(driveModifiedTime);\n      setSales(newSales);\n      if (hasAdsTab) setAdsSpend(String(newAdsSpend));",
  "setLastSyncDate(driveModifiedTime);\n      setSales(newSales);\n      if (hasAdsTab) setAdsSpend(String(newAdsSpend));\n      saveMainDashboard(newSales, hasAdsTab ? newAdsSpend : (Number(adsSpend) || 0), driveModifiedTime);"
);

fs.writeFileSync('src/App.tsx', code);
console.log("Patched App.tsx save");
