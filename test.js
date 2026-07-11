const fs = require('fs');
fetch("https://docs.google.com/spreadsheets/d/1GV5jhhjmHIgveGAvvi0xfHJVNDk40Lu4nb4RL2eBuqE/gviz/tq?tqx=out:csv&sheet=Junho").then(r=>r.text()).then(console.log);
