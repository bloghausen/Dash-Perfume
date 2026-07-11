const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const target = `  const [activeTab, setActiveTab] = useState<string>('home');`;

const replacement = `  const [activeTab, setActiveTab] = useState<string>('home');
  const isReadonly = useMemo(() => new URLSearchParams(window.location.search).get('readonly') === 'true', []);`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync(file, code);
    console.log("Patched isReadonly!");
} else {
    console.log("Target not found!");
}
