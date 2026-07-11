const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `            </div>
          </header>`;

const replacement = `            </div>
            )}
          </header>`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched header actions end!");
} else {
    console.log("Target not found!");
}
