const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target1 = `<button className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-800 transition-colors" onClick={() => setActiveTab('sales')}>Ver Todos</button>`;
const replacement1 = `{!isReadonly && <button className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-800 transition-colors" onClick={() => setActiveTab('sales')}>Ver Todos</button>}`;

const target2 = `<button className="flex-1 text-center py-2 text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => setActiveTab('sales')}>Volume</button>`;
const replacement2 = `<button className="flex-1 text-center py-2 text-xs font-bold text-slate-500 cursor-pointer hover:text-slate-700" onClick={() => !isReadonly && setActiveTab('sales')}>Volume</button>`;

const target3 = `<button className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-800 transition-colors" onClick={() => setActiveTab('products')}>Ver Todos</button>`;
const replacement3 = `{!isReadonly && <button className="text-xs font-bold text-slate-400 cursor-pointer hover:text-slate-800 transition-colors" onClick={() => setActiveTab('products')}>Ver Todos</button>}`;


if (code.includes(target1)) code = code.replace(target1, replacement1);
if (code.includes(target2)) code = code.replace(target2, replacement2);
if (code.includes(target3)) code = code.replace(target3, replacement3);

fs.writeFileSync(file, code);
console.log("Patched ver todos buttons!");
