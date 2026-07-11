const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `<button className="w-10 h-10 rounded-[1rem] bg-slate-50 flex items-center justify-center border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors text-slate-400 hover:text-[#5b42f3]" onClick={() => setActiveTab('charts')}>`;

const replacement = `{!isReadonly && <button className="w-10 h-10 rounded-[1rem] bg-slate-50 flex items-center justify-center border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors text-slate-400 hover:text-[#5b42f3]" onClick={() => setActiveTab('charts')}>}`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    // add closing brace for the button
    code = code.replace(`                              <BarChart3 className="w-4 h-4" />\n                            </button>`, `                              <BarChart3 className="w-4 h-4" />\n                            </button>}`);
    fs.writeFileSync(file, code);
    console.log("Patched charts btn!");
} else {
    console.log("Target not found!");
}
