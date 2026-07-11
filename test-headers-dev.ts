const run = async () => {
  const res = await fetch("https://ais-dev-voxkv3ztrap3l47ijfj3px-336209293768.us-east1.run.app", { redirect: 'manual' });
  console.log([...res.headers.entries()]);
};
run();
