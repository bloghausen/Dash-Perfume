const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const startIdx = code.indexOf('<div className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs overflow-auto h-64 whitespace-pre-wrap">');
if (startIdx !== -1) {
   const endStr = '</div>';
   const endIdx = code.indexOf(endStr, startIdx);
   if (endIdx !== -1) {
      const newCode = code.substring(0, startIdx) + code.substring(endIdx + endStr.length);
      fs.writeFileSync('src/App.tsx', newCode);
      console.log("Removed debug.");
   }
}
