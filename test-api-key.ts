import firebaseConfig from './firebase-applet-config.json' with { type: 'json' };

const run = async () => {
  try {
    const res = await fetch(`https://sheets.googleapis.com/v4/spreadsheets/1OS2myuQp4DtwCqjqnv1266Br3dkXUSzh-pe3YsxjPQc?key=${firebaseConfig.apiKey}`);
    console.log("Status:", res.status);
    const data = await res.json();
    console.log(data);
  } catch (e) {
    console.error(e);
  }
};
run();
