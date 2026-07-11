const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `<Tooltip 
                              contentStyle={{ backgroundColor: 'white', borderRadius: '1.5rem', border: 'none', color: '#1e293b', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)', padding: '12px 20px' }}
                              itemStyle={{ fontStep: 'bold' }}
                              cursor={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 2, strokeDasharray: '5 5' }}
                            />`;
const replacement1 = `<Tooltip 
                              contentStyle={{ backgroundColor: 'white', borderRadius: '1.5rem', border: 'none', color: '#1e293b', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.2)', padding: '12px 20px' }}
                              itemStyle={{ fontWeight: 'bold' }}
                              cursor={{ stroke: 'rgba(255,255,255,0.3)', strokeWidth: 2, strokeDasharray: '5 5' }}
                              formatter={(value, name) => {
                                if (name === 'Receita') return ['R$ ' + Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2}), name];
                                return [value, name];
                              }}
                            />`;

let newCode = code.replace(target1, replacement1);

const target2 = `<Tooltip formatter={(value: any) => \`R$ \${Number(value).toLocaleString('pt-BR')}\`} />`;
const replacement2 = `<Tooltip formatter={(value: any) => \`R$ \${Number(value).toLocaleString('pt-BR', {minimumFractionDigits: 2, maximumFractionDigits: 2})}\`} />`;

// There are multiple instances of target2
newCode = newCode.split(target2).join(replacement2);

const target3 = `<Tooltip />`;
const replacement3 = `<Tooltip formatter={(value, name) => [value, name]} />`;
newCode = newCode.replace(target3, replacement3);

fs.writeFileSync('src/App.tsx', newCode);
console.log("Patched tooltips.");
