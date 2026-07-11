const fs = require('fs');
let code = fs.readFileSync('src/firebase.ts', 'utf8');

code = code.replace("sales: parsedSales,", "sales: parsedSales,\n        lastSyncDate: data.lastSyncDate || null,");

const saveMainCode = `
export async function saveMainDashboard(sales: any[], adsSpend: number, lastSyncDate: string) {
  if (!auth.currentUser) return;
  const dashboardRef = doc(db, 'dashboards', 'main');
  const payloadStr = LZString.compressToBase64(JSON.stringify(sales));
  
  const payload = {
    ownerId: auth.currentUser.uid,
    sales: payloadStr,
    adsSpend: Number(adsSpend) || 0,
    lastSyncDate: lastSyncDate,
    updatedAt: serverTimestamp()
  };
  
  try {
    await setDoc(dashboardRef, payload);
  } catch (err) {
    console.error("Error saving main dashboard", err);
  }
}
`;

code = code + "\n" + saveMainCode;

fs.writeFileSync('src/firebase.ts', code);
console.log("Patched firebase.ts");
