const mlist = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const titles = ['Junho', 'junho', 'Junho 2024', 'jun 2024', '06-2024', 'Planilha de junho'];

for (const title of titles) {
    let defaultMonth = 'Desconhecido';
    const normalizedTitle = title.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
    const matchedTab = mlist.find((mo, idx) => {
        const moNorm = mo.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        const numStr = String(idx + 1).padStart(2, '0');
        return normalizedTitle === moNorm || 
              normalizedTitle.includes(moNorm.substring(0,3)) ||
              normalizedTitle.includes('/' + numStr + '/') ||
              normalizedTitle.includes('-' + numStr + '-') ||
              normalizedTitle.endsWith('/' + numStr) ||
              normalizedTitle.endsWith('-' + numStr) ||
              normalizedTitle.startsWith(numStr + '/') ||
              normalizedTitle.startsWith(numStr + '-') ||
              normalizedTitle === numStr;
    });
    if (matchedTab) defaultMonth = matchedTab;
    console.log(`Title: "${title}" -> ${defaultMonth}`);
}
