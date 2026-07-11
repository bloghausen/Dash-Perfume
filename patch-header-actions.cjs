const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `            <div className="flex gap-4 items-center bg-white p-2 pl-4 rounded-full shadow-sm">
              <div className="flex items-center gap-2">`;

const replacement = `            {!isReadonly && (
            <div className="flex gap-4 items-center bg-white p-2 pl-4 rounded-full shadow-sm">
              <div className="flex items-center gap-2">`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched header actions start!");
} else {
    console.log("Target not found!");
}
