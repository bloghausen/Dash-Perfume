const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `                    {!isReadonly && <button className="w-10 h-10 rounded-[1rem] bg-slate-50 flex items-center justify-center border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors text-slate-400 hover:text-[#5b42f3]" onClick={() => setActiveTab('charts')}>}
                       <BarChart3 className="w-5 h-5" />
                    </button>`;

const replacement = `                    {!isReadonly && (
                      <button className="w-10 h-10 rounded-[1rem] bg-slate-50 flex items-center justify-center border border-slate-100 cursor-pointer hover:bg-slate-100 transition-colors text-slate-400 hover:text-[#5b42f3]" onClick={() => setActiveTab('charts')}>
                         <BarChart3 className="w-5 h-5" />
                      </button>
                    )}`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched charts btn properly!");
} else {
    console.log("Target not found!");
}
