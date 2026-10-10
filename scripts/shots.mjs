// Скриншоты всех экранов в светлой и тёмной теме: node scripts/shots.mjs <url> <outdir>
import { chromium } from "playwright";
const [url = "http://localhost:4173", out = "shots"] = process.argv.slice(2);
const SCREENS = ["home", "workout", "rest", "finish", "progress", "history"];
const browser = await chromium.launch({ executablePath: process.env.CHROME_PATH || undefined });
for (const theme of ["light", "dark"]) {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
  for (const s of SCREENS) {
    await page.goto(`${url}/?screen=${s}&theme=${theme}`, { timeout: 15000 });
    await page.waitForSelector("main > *", { timeout: 5000 });
    await page.screenshot({ path: `${out}/${theme}-${s}.png` });
  }
  await page.close();
}
await browser.close();
