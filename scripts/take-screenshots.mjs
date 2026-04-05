/**
 * Automated screenshot capture for README documentation.
 * Usage: node scripts/take-screenshots.mjs
 * Requires: dev server running on localhost:3000
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";

const BASE = "http://localhost:3000";
const OUT = "docs/images";

mkdirSync(OUT, { recursive: true });

async function clickById(page, id) {
  await page.evaluate((elId) => {
    document.getElementById(elId)?.click();
  }, id);
}

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });

  // 1. Landing page
  console.log("📸 Landing page...");
  const landing = await context.newPage();
  await landing.goto(BASE, { waitUntil: "networkidle" });
  await landing.waitForTimeout(1000);
  await landing.screenshot({ path: `${OUT}/landing-page.png`, fullPage: false });
  await landing.close();

  // 2. Office main
  console.log("📸 Office page...");
  const office = await context.newPage();
  await office.goto(`${BASE}/office`, { waitUntil: "domcontentloaded" });
  await office.waitForTimeout(4000);

  // Click "Demo ile Başla" if connection screen is showing
  const demoBtn = office.locator('button:has-text("Demo")').first();
  if (await demoBtn.isVisible({ timeout: 3000 }).catch(() => false)) {
    await demoBtn.click();
    await office.waitForTimeout(5000);
  }
  await office.waitForTimeout(2000);
  await office.screenshot({ path: `${OUT}/office-main.png`, fullPage: false });

  // 3. Open HQ sidebar — click the vertical "KARARGAH" button
  console.log("📸 HQ sidebar...");
  // The HQ toggle is a vertical text button on the right side
  const hqToggle = office.locator('button[aria-expanded]').first();
  if (await hqToggle.isVisible({ timeout: 3000 }).catch(() => false)) {
    await hqToggle.click();
    await office.waitForTimeout(1500);
    // Take inbox (default) screenshot as settings-panel
    await office.screenshot({ path: `${OUT}/settings-panel.png`, fullPage: false });
  }

  // 4. Kanban tab — use JS click to bypass overlap
  console.log("📸 Kanban...");
  await clickById(office, "hq-tab-kanban");
  await office.waitForTimeout(2000);
  await office.screenshot({ path: `${OUT}/kanban-board.png`, fullPage: false });
  // Close kanban modal
  await office.keyboard.press("Escape");
  await office.waitForTimeout(500);

  // 5. Memory Wall tab
  console.log("📸 Memory Wall...");
  await clickById(office, "hq-tab-memoryWall");
  await office.waitForTimeout(1000);
  await office.screenshot({ path: `${OUT}/memory-wall.png`, fullPage: false });

  // 6. Task Queue tab
  console.log("📸 Task Queue...");
  await clickById(office, "hq-tab-taskQueue");
  await office.waitForTimeout(1000);
  await office.screenshot({ path: `${OUT}/task-queue.png`, fullPage: false });

  await office.close();

  // 7. Office builder
  console.log("📸 Office builder...");
  const builder = await context.newPage();
  await builder.goto(`${BASE}/office/builder`, { waitUntil: "domcontentloaded" });
  await builder.waitForTimeout(3000);
  await builder.screenshot({ path: `${OUT}/office-builder.png`, fullPage: false });
  await builder.close();

  await browser.close();
  console.log("✅ All screenshots saved to docs/images/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
