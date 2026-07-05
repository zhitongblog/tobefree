// Render public/favicon.svg -> PNG icons for the web manifest & Apple touch icon.
// Run: node scripts/gen-icons.mjs
import sharp from 'sharp';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const dir = dirname(fileURLToPath(import.meta.url));
const pub = join(dir, '..', 'public');
const svg = readFileSync(join(pub, 'favicon.svg'));

const sizes = {
  'apple-touch-icon.png': 180,
  'icon-192.png': 192,
  'icon-512.png': 512,
  'favicon-32.png': 32,
};

for (const [name, size] of Object.entries(sizes)) {
  await sharp(svg, { density: 384 }).resize(size, size).png().toFile(join(pub, name));
  console.log('✓', name, `${size}x${size}`);
}
