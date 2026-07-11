const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `      </nav>

      {/* MAIN LAYOUT */}`;

const replacement = `      </nav>
      )}

      {/* MAIN LAYOUT */}`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched sidebar end!");
} else {
    console.log("Target not found!");
}
