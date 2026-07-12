const fs = require('fs');

async function run() {
    const spreadsheetId = '1GV5jhhjmHIgveGAvvi0xfHJVNDk40Lu4nb4RL2eBuqE';
    const mlist = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    
    for (const m of mlist) {
        const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(m)}`;
        const res = await fetch(url);
        const text = await res.text();
        const lines = text.split('\n').filter(l => l.trim().length > 0);
        console.log(`Month ${m}: ${lines.length} lines`);
        if (m === 'Dezembro' || m === 'Agosto') {
            console.log(lines.slice(0, 3).join('\n'));
        }
    }
}
run();
