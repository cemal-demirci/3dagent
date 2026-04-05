/**
 * Captures landing page section screenshots for README / docs.
 * Usage: node scripts/take-landing-screenshots.mjs
 * Requires: dev server running on localhost:3000
 */
import { chromium } from "@playwright/test";
import { mkdirSync } from "fs";

const BASE = "http://localhost:3000";
const OUT = "docs/images";

mkdirSync(OUT, { recursive: true });

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: "dark",
  });

  const page = await context.newPage();
  await page.goto(BASE, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);

  // 1. Hero — first viewport
  console.log("📸 Hero...");
  await page.screenshot({ path: `${OUT}/landing-hero.png` });

  // 2. Full page — long screenshot of entire landing
  console.log("📸 Full landing page...");
  await page.screenshot({ path: `${OUT}/landing-full.png`, fullPage: true });

  // 3. Comparison table — scroll to "CLAW3D vs 3DAGENT" section
  console.log("📸 Comparison table...");
  const comparisonHeading = page.locator('text=CLAW3D vs 3DAGENT').first();
  if (await comparisonHeading.isVisible({ timeout: 3000 }).catch(() => false)) {
    await comparisonHeading.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    // Scroll up a bit so the section tag is visible
    await page.evaluate(() => window.scrollBy(0, -80));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/landing-comparison.png` });
  }

  // 4. Agents section
  console.log("📸 Agents...");
  const agentsHeading = page.locator('text=6 HAZIR AI AJANI').first();
  if (await agentsHeading.isVisible({ timeout: 3000 }).catch(() => false)) {
    await agentsHeading.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -80));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/landing-agents.png` });
  }

  // 5. Unique features section
  console.log("📸 Unique features...");
  const featuresHeading = page.locator("text=3DAGENT'A ÖZEL").first();
  if (await featuresHeading.isVisible({ timeout: 3000 }).catch(() => false)) {
    await featuresHeading.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -80));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/landing-features.png` });
  }

  // 6. HQ Panels section
  console.log("📸 HQ Panels...");
  const hqHeading = page.locator('text=12 KARARGÂH PANELİ').first();
  if (await hqHeading.isVisible({ timeout: 3000 }).catch(() => false)) {
    await hqHeading.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -80));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/landing-hq-panels.png` });
  }

  // 7. Immersive screens
  console.log("📸 Immersive screens...");
  const immersiveHeading = page.locator('text=7 SÜRÜKLEYİCİ EKRAN').first();
  if (await immersiveHeading.isVisible({ timeout: 3000 }).catch(() => false)) {
    await immersiveHeading.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -80));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/landing-immersive.png` });
  }

  // 8. Tech stack + Getting started
  console.log("📸 Tech stack...");
  const techHeading = page.locator('text=TECH STACK').first();
  if (await techHeading.isVisible({ timeout: 3000 }).catch(() => false)) {
    await techHeading.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -80));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/landing-tech-stack.png` });
  }

  // 9. CTA banner
  console.log("📸 CTA...");
  const ctaHeading = page.locator('text=HAZIR MISINIZ').first();
  if (await ctaHeading.isVisible({ timeout: 3000 }).catch(() => false)) {
    await ctaHeading.scrollIntoViewIfNeeded();
    await page.evaluate(() => window.scrollBy(0, -100));
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${OUT}/landing-cta.png` });
  }

  await page.close();
  await browser.close();
  console.log("✅ All landing screenshots saved to docs/images/");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
