const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `{/* Monthly Comparison */}`;
const replacement = `
                    <div className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs overflow-auto h-64 whitespace-pre-wrap">
                       {JSON.stringify({
                          junhoSalesCount: sales.filter(s => s.month === 'Junho').length,
                          totalSales: sales.length,
                          junhoQtd: sales.filter(s => s.month === 'Junho').reduce((acc, s) => acc + s.quantity, 0),
                          junhoRec: sales.filter(s => s.month === 'Junho').reduce((acc, s) => acc + s.totalPrice, 0),
                          sampleMissing: sales.filter(s => s.month === 'Junho').slice(-10)
                       }, null, 2)}
                    </div>
                    {/* Monthly Comparison */}`;

if (code.includes(target)) {
  fs.writeFileSync('src/App.tsx', code.replace(target, replacement));
  console.log("Patched debug.");
} else {
  console.log("Target not found!");
}
