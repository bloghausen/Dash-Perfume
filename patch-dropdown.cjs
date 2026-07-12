const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const targetDropdown = `{months.map(m => (
                              <option key={m} value={m} className="text-slate-800">{m}</option>
                            ))}`;

const replacementDropdown = `{['Todos', ...monthlyData.map(m => m.name)].map(m => (
                              <option key={m} value={m} className="text-slate-800">{m}</option>
                            ))}`;

code = code.replace(targetDropdown, replacementDropdown);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched dropdown");
