// Layout QA: screenshots every section at desktop and mobile, then checks for
// overlapping text, clipped text and horizontal scroll.
// Usage: node scripts/qa.mjs [url] [outDir]   (needs a running server and Chrome)
import { mkdirSync } from "node:fs";
import { chromium } from "playwright-core";

const URL = process.argv[2] || "http://localhost:3000";
const OUT = process.argv[3] || "qa-screenshots";
const CHROME = process.env.CHROME_PATH || "/usr/local/bin/google-chrome";
const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900 },
  { name: "mobile", width: 390, height: 844, isMobile: true, hasTouch: true, deviceScaleFactor: 2 },
];
const PAGES = ["/", "/blog"];

mkdirSync(OUT, { recursive: true });

/** Runs in the page. Returns overlap, clip and overflow problems, optionally scoped to `rootSelector`. */
function audit(rootSelector) {
  const problems = [];
  const root = rootSelector ? document.querySelector(rootSelector) : document.body;
  const vw = document.documentElement.clientWidth;
  if (document.documentElement.scrollWidth > vw + 1) {
    const culprits = [...document.querySelectorAll("body *")]
      .filter((el) => el.getBoundingClientRect().right > vw + 1)
      .slice(0, 5)
      .map((el) => `${el.tagName.toLowerCase()}.${String(el.className).slice(0, 60)}`);
    problems.push({ type: "horizontal-scroll", scrollWidth: document.documentElement.scrollWidth, vw, culprits });
  }

  // Line boxes are taller than the glyphs, so tight leading would always "overlap".
  // Measure the actual ink extent of each text run instead.
  const ctx = document.createElement("canvas").getContext("2d");
  const inkBox = (el, r, text) => {
    const cs = getComputedStyle(el);
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx.measureText(text);
    const contentH = m.fontBoundingBoxAscent + m.fontBoundingBoxDescent;
    const baseline = r.top + (r.height - contentH) / 2 + m.fontBoundingBoxAscent;
    return { left: r.left, right: r.right, top: baseline - m.actualBoundingBoxAscent, bottom: baseline + m.actualBoundingBoxDescent };
  };

  const visible = (el) =>
    el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) &&
    !el.closest(".sr-only, [hidden], [aria-hidden='true'] .invisible");

  // Sticky/fixed UI (the nav) floats over scrolled content by design; only compare text within the same layer.
  const layerOf = (el) => {
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      if (/(sticky|fixed)/.test(getComputedStyle(p).position)) return p;
    }
    return null;
  };

  const rects = [];
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent.trim()) continue;
    const el = node.parentElement;
    if (!el || !visible(el) || el.closest("script, style, noscript")) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const text = node.textContent.trim();
    for (const r of range.getClientRects()) {
      if (r.width < 1 || r.height < 1) continue;
      rects.push({ el, r, ink: inkBox(el, r, text), text: text.slice(0, 40), layer: layerOf(el) });
    }
  }

  const describe = (el) => {
    const id = el.closest("section[id], section[aria-labelledby], header, footer");
    return `${el.tagName.toLowerCase()}${el.className && typeof el.className === "string" ? "." + el.className.split(" ").slice(0, 2).join(".") : ""} in ${id ? id.id || id.getAttribute("aria-labelledby") || id.tagName : "?"}`;
  };

  // Overlap: text boxes from different elements must not intersect (2px tolerance for kerning/line boxes).
  for (let a = 0; a < rects.length; a++) {
    for (let b = a + 1; b < rects.length; b++) {
      const A = rects[a],
        B = rects[b];
      if (A.el === B.el || A.layer !== B.layer) continue;
      const ix = Math.min(A.ink.right, B.ink.right) - Math.max(A.ink.left, B.ink.left);
      const iy = Math.min(A.ink.bottom, B.ink.bottom) - Math.max(A.ink.top, B.ink.top);
      if (ix > 1 && iy > 1) {
        problems.push({ type: "overlap", a: A.text, b: B.text, where: describe(A.el), ix: Math.round(ix), iy: Math.round(iy) });
      }
    }
  }

  // Clipping: text must sit inside every ancestor that clips overflow, and inside the viewport horizontally.
  for (const { el, r, ink, text } of rects) {
    if (r.right > vw + 1 || r.left < -1) problems.push({ type: "offscreen", text, where: describe(el), left: r.left, right: r.right });
    for (let p = el; p && p !== document.body; p = p.parentElement) {
      const cs = getComputedStyle(p);
      if (!/(hidden|clip|auto|scroll)/.test(cs.overflowX + cs.overflowY)) continue;
      const c = p.getBoundingClientRect();
      if (ink.left < c.left - 1 || ink.right > c.right + 1 || ink.top < c.top - 1 || ink.bottom > c.bottom + 1) {
        problems.push({ type: "clipped", text, where: describe(el), box: [r.left, r.top, r.right, r.bottom].map(Math.round), clip: [c.left, c.top, c.right, c.bottom].map(Math.round) });
      }
      break;
    }
  }

  // Ellipsis/overflowing single elements.
  for (const el of root.querySelectorAll("*")) {
    if (!visible(el) || !el.textContent.trim()) continue;
    const cs = getComputedStyle(el);
    if (cs.overflowX !== "visible" && el.scrollWidth > el.clientWidth + 1 && el.children.length === 0) {
      problems.push({ type: "text-overflow", text: el.textContent.trim().slice(0, 40), where: describe(el) });
    }
  }
  return problems;
}

const browser = await chromium.launch({ executablePath: CHROME, args: ["--no-sandbox"] });
let failures = 0;

for (const vp of VIEWPORTS) {
  const context = await browser.newContext({ viewport: { width: vp.width, height: vp.height }, ...vp });
  const page = await context.newPage();
  for (const path of PAGES) {
    const slug = path === "/" ? "home" : path.slice(1);
    await page.goto(URL + path, { waitUntil: "networkidle" });
    await page.waitForTimeout(1200);

    // Scroll through every section so reveals, count-ups and the terminal run, screenshotting each viewport.
    const sections = await page.$$eval("main > section, main section, footer", (els) =>
      els.map((e) => ({ id: e.id || e.getAttribute("aria-labelledby") || e.tagName.toLowerCase(), top: e.getBoundingClientRect().top + scrollY })),
    );
    const seen = new Set();
    for (const s of sections) {
      if (seen.has(s.id)) continue;
      seen.add(s.id);
      await page.evaluate((y) => window.scrollTo({ top: y - 64, behavior: "instant" }), s.top);
      await page.waitForTimeout(path === "/" && s.id === "process" ? 4500 : 2200);
      await page.screenshot({ path: `${OUT}/${vp.name}-${slug}-${s.id}.png` });
    }
    // Step through each chapter of the scroll-driven scene and audit every state.
    const storyProblems = [];
    const steps = await page.$$eval("[data-scrolly]", (els) => els.length && 4);
    for (let n = 0; n < steps; n++) {
      await page.evaluate((n) => {
        const el = document.querySelector("[data-scrolly]");
        const range = el.offsetHeight - el.firstElementChild.offsetHeight;
        const top = el.getBoundingClientRect().top + scrollY;
        window.scrollTo({ top: top + ((n + 0.5) / 4) * range, behavior: "instant" });
      }, n);
      await page.waitForTimeout(1800);
      await page.screenshot({ path: `${OUT}/${vp.name}-${slug}-story-${n + 1}.png` });
      for (const p of await page.evaluate(audit, "[data-scrolly]")) storyProblems.push({ step: n + 1, ...p });
    }

    await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
    await page.waitForTimeout(600);
    await page.screenshot({ path: `${OUT}/${vp.name}-${slug}-full.png`, fullPage: true });

    // Open every FAQ item so the answers are checked too.
    await page.$$eval("details", (ds) => ds.forEach((d) => d.removeAttribute("name") || (d.open = true)));
    await page.waitForTimeout(1500);
    if (path === "/" && (await page.$("#faq"))) {
      await page.addStyleTag({ content: "body > header { visibility: hidden }" });
      await page.locator("#faq").screenshot({ path: `${OUT}/${vp.name}-${slug}-faq-open.png` });
      await page.addStyleTag({ content: "body > header { visibility: visible }" });
      // The element screenshot scrolls the page; let scroll-driven cross-fades settle before auditing.
      await page.waitForTimeout(1200);
    }

    const problems = [...storyProblems, ...(await page.evaluate(audit, null))];
    if (vp.isMobile && path === "/" && (await page.$("button[aria-controls]"))) {
      await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
      await page.click("button[aria-controls]");
      await page.waitForTimeout(250);
      await page.screenshot({ path: `${OUT}/${vp.name}-${slug}-menu.png` });
      problems.push(...(await page.evaluate(audit, "body > header")));
      await page.click("button[aria-controls]");
    }
    failures += problems.length;
    console.log(`${vp.name} ${path}: ${problems.length ? problems.length + " problem(s)" : "ok"}`);
    for (const p of problems) console.log("  ", JSON.stringify(p));
  }
  await context.close();
}

await browser.close();
process.exit(failures ? 1 : 0);
