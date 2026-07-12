import { initializeApp } from 'firebase/app';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import fs from 'fs';
import LZString from 'lz-string';

const firebaseConfig = JSON.parse(fs.readFileSync('./firebase-applet-config.json', 'utf8'));
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  try {
    const docSnap = await getDoc(doc(db, 'dashboards', 'main'));
    if (docSnap.exists()) {
       console.log("Main doc exists!");
       const data = docSnap.data();
       console.log("Sales raw length:", data.sales ? data.sales.length : 0);
       let parsedSales = [];
       if (data.sales) {
          let decompressed = LZString.decompressFromBase64(data.sales);
          if (decompressed) {
             parsedSales = JSON.parse(decompressed);
          }
       }
       console.log("Parsed sales length:", parsedSales.length);
    } else {
       console.log("Main doc DOES NOT EXIST.");
    }
  } catch (e) {
    console.error(e);
  }
  process.exit(0);
}
run();
