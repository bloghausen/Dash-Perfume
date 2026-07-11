const mlist = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const tabsToTry = [...mlist, 'ADS'];
const fetch = require('node-fetch');

const fetchPublicSheet = async (sheetName) => {
  const spreadsheetId = '1GV5jhhjmHIgveGAvvi0xfHJVNDk40Lu4nb4RL2eBuqE';
  const url = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(sheetName)}`;
  try {
    const res = await fetch(url);
    const text = await res.text();
    if (text.includes('<html') || text.includes('<!DOCTYPE html>')) {
      return null;
    }
    return text;
  } catch (e) {
    return null;
  }
};

async function run() {
  for (const tab of tabsToTry) {
     const res = await fetchPublicSheet(tab);
     if (res) console.log(tab, "success");
     else console.log(tab, "fail");
  }
}
run();
