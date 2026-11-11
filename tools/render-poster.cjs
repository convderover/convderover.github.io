// node tools/render-poster.cjs <outdir>  (needs the local server on :8090 and Playwright)
const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  const out = process.argv[2] || ".";
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1 });
  const jobs = [["anatomy", "light", "heart-poster"], ["signal", "light", "heart-signal-light"], ["signal", "dark", "heart-signal-dark"], ["recon", "light", "heart-recon-light"], ["recon", "dark", "heart-recon-dark"]];
  for (const [mode, theme, file] of jobs) {
    await page.goto(`http://127.0.0.1:8090/tools/poster.html?mode=${mode}&theme=${theme}`);
    await page.waitForFunction(() => window.posterReady || window.posterError, null, { timeout: 60000 });
    const url = await page.evaluate(() => document.getElementById("c").toDataURL("image/png"));
    fs.writeFileSync(`${out}/${file}.png`, Buffer.from(url.split(",")[1], "base64"));
    console.log("wrote", file);
  }
  await browser.close();
})();
