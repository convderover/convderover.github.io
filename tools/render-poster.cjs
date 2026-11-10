// node tools/render-poster.cjs  (needs the local server on :8090 and Playwright)
const { chromium } = require("playwright");
const fs = require("fs");
(async () => {
  const browser = await chromium.launch({ args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
  const page = await browser.newPage({ viewport: { width: 1200, height: 1200 }, deviceScaleFactor: 1 });
  for (const [mode, file] of [["anatomy", "heart-poster"], ["signal", "heart-signal"], ["recon", "heart-recon"]]) {
    await page.goto(`http://127.0.0.1:8090/tools/poster.html?mode=${mode}`);
    await page.waitForFunction(() => window.posterReady || window.posterError, null, { timeout: 60000 });
    const url = await page.evaluate(() => document.getElementById("c").toDataURL("image/png"));
    fs.writeFileSync(`${process.argv[2] || "."}/${file}.png`, Buffer.from(url.split(",")[1], "base64"));
    console.log("wrote", file);
  }
  await browser.close();
})();
