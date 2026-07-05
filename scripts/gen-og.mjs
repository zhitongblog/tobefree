// Render scripts/og.svg -> public/og-default.png (1200x630 social share image).
// Uses sharp (bundled with Astro). Run: node scripts/gen-og.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const svg = readFileSync(join(dir, 'og.svg'));
const out = join(dir, '..', 'public', 'og-default.png');

await sharp(svg, { density: 144 })
  .resize(1200, 630)
  .png()
  .toFile(out);

console.log('✓ wrote', out);
