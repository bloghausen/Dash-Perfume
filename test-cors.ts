const run = async () => {
  try {
    const res = await fetch("https://docs.google.com/spreadsheets/d/1OS2myuQp4DtwCqjqnv1266Br3dkXUSzh-pe3YsxjPQc/export?format=xlsx", { method: 'HEAD' });
    console.log("Status:", res.status);
    console.log("CORS:", res.headers.get("access-control-allow-origin"));
  } catch (e) {
    console.error(e);
  }
};
run();
