import { existsSync, writeFileSync } from "fs";
import puppeteer from "puppeteer-core";

const CHROME = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const EDGE = "C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe";
const URL = process.argv[2] || "http://localhost:5199/";

const browser = await puppeteer.launch({
  executablePath: existsSync(CHROME) ? CHROME : EDGE,
  headless: "new",
  args: ["--no-sandbox", "--disable-gpu", "--window-size=1440,900"],
});
const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });

const errors = [];
page.on("console", (m) => { if (["error", "warning"].includes(m.type())) errors.push(`${m.type()}: ${m.text()}`); });
page.on("pageerror", (e) => errors.push(`pageerror: ${e.message}`));

await page.goto(URL, { waitUntil: "networkidle2", timeout: 60000 });
await new Promise((r) => setTimeout(r, 3000));

const ids = ["home", "projects", "services", "about", "process", "blueprint", "contact", "materials"];

function audit() {
  const ids = ["home", "projects", "services", "about", "process", "blueprint", "contact", "materials"];
  const out = [];
  for (const id of ids) {
    const el = document.getElementById(id);
    if (!el) { out.push({ id, mounted: false }); continue; }
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const hidden = el.closest("[data-reveal]:not(.is-revealed)") && parseFloat(cs.opacity) < 0.1;
    out.push({
      id, mounted: true,
      h: Math.round(r.height), top: Math.round(r.top + scrollY),
      opacity: cs.opacity, display: cs.display, visibility: cs.visibility,
      text: (el.innerText || "").replace(/\s+/g, " ").slice(0, 60),
      suspectHidden: hidden || cs.display === "none" || cs.visibility === "hidden" || r.height < 40,
    });
  }
  return { ids: out, docH: document.documentElement.scrollHeight, links: [...document.querySelectorAll("a")].length };
}

// 1. top-of-page state
const top = await page.evaluate(audit);

// 2. scroll to bottom like a user, checking opacity along the way
const steps = 14;
const midSamples = [];
for (let i = 1; i <= steps; i++) {
  await page.evaluate((p) => window.scrollTo(0, document.documentElement.scrollHeight * p), i / steps);
  await new Promise((r) => setTimeout(r, 350));
  midSamples.push(await page.evaluate(() => {
    const vis = [...document.querySelectorAll("#projects,#services,#about,#process,#blueprint,#contact,#materials")].map((el) => {
      const r = el.getBoundingClientRect();
      return r.top < innerHeight && r.bottom > 0;
    });
    return { y: Math.round(scrollY), anySectionInView: vis.some(Boolean), inViewCount: vis.filter(Boolean).length };
  }));
}

const bottom = await page.evaluate(audit);
const report = JSON.stringify({ top, midSamples, bottom, errors: errors.slice(0, 20) }, null, 2);
console.log(report);
writeFileSync(new URL("../verify-out.json", import.meta.url), report, "utf8");
await browser.close();
