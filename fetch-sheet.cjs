const fs = require('fs');

async function run() {
  const token = fs.readFileSync('.env', 'utf8').match(/G_TOKEN=(.+)/)[1];
  const spreadsheetId = '1mC4hI1zDEDX2vO3k3jB3N2cR-o638D92fP6rCfs6W-Y';
  
  const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Junho?valueRenderOption=UNFORMATTED_VALUE`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  const data = await res.json();
  fs.writeFileSync('junho-data.json', JSON.stringify(data, null, 2));
  console.log("Saved.");
}
run();
