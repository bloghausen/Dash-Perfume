const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `      {/* SIDEBAR LEFT */}
      <nav className="w-24 bg-[#5b42f3] rounded-[2.5rem] flex flex-col items-center py-8 shadow-2xl shrink-0 h-[calc(100vh-32px)] overflow-y-auto">`;

const replacement = `      {/* SIDEBAR LEFT */}
      {!isReadonly && (
      <nav className="w-24 bg-[#5b42f3] rounded-[2.5rem] flex flex-col items-center py-8 shadow-2xl shrink-0 h-[calc(100vh-32px)] overflow-y-auto">`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched sidebar start!");
} else {
    console.log("Target not found!");
}
