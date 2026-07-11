const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `      const mlist = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];`;
code = code.replace(target1, '');

const target2 = `      // Extract month from document title as fallback
      let docMonth = 'Desconhecido';`;
const replacement2 = `      const mlist = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
      
      // Extract month from document title as fallback
      let docMonth = 'Desconhecido';`;

code = code.replace(target2, replacement2);
fs.writeFileSync('src/App.tsx', code);
console.log("Patched mlist!");
