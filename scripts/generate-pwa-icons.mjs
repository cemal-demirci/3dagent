/**
 * Generate PWA icons from public/favicon.svg using sharp.
 * Output: public/icons/icon-192x192.png, icon-512x512.png, apple-touch-icon.png
 */
import { readFileSync, mkdirSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import sharp from "sharp";

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = join(__dirname, "..");
const src = join(root, "public", "favicon.svg");
const outDir = join(root, "public", "icons");

mkdirSync(outDir, { recursive: true });

const svg = readFileSync(src);

const sizes = [
  { name: "icon-192x192.png", size: 192 },
  { name: "icon-512x512.png", size: 512 },
  { name: "apple-touch-icon.png", size: 180 },
];

for (const { name, size } of sizes) {
  await sharp(svg).resize(size, size).png().toFile(join(outDir, name));
  console.log(`  ✓ ${name} (${size}x${size})`);
}

console.log("PWA icons generated.");
