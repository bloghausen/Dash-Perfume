async function run() {
    const spreadsheetId = '1GV5jhhjmHIgveGAvvi0xfHJVNDk40Lu4nb4RL2eBuqE';
    const sheetName = 'ADS';
    const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
    const res = await fetch(url);
    const text = await res.text();
    console.log(text);
}
run();
