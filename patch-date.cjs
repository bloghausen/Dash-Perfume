const fs = require('fs');
const code = fs.readFileSync('src/App.tsx', 'utf8');

const target = `          let monthStr = monthName;
          const mlist = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
          
          // check if there's a Date column to override month`;

const replacement = `          let monthStr = monthName;
          const mlist = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
          
          const isTabAMonth = mlist.some(m => m.toLowerCase() === monthName.toLowerCase().trim());
          
          // check if there's a Date column to override month`;

// Wait, the logic block is quite large. Let's just find where it sets `monthStr = ...` and wrap the date column checking in `if (!isTabAMonth)`
