const run = async () => {
    const res = await fetch("https://docs.google.com/spreadsheets/d/1OS2myuQp4DtwCqjqnv1266Br3dkXUSzh-pe3YsxjPQc/export?format=csv&gid=0", { redirect: 'manual' });
    console.log("Status:", res.status);
    console.log("Location:", res.headers.get("location"));
};
run();
