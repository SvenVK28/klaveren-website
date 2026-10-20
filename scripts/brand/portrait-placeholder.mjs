// Draws the stand-in for the owner's portrait (src/content/site/images/portret-placeholder.png):
// a neutral silhouette, so nobody mistakes a stock photo for the real person.
//   node scripts/brand/portrait-placeholder.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const out = fileURLToPath(new URL('../../src/content/site/images/portret-placeholder.png', import.meta.url));
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000" viewBox="0 0 1600 1000">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#eef1f3"/>
      <stop offset="1" stop-color="#dfe5e9"/>
    </linearGradient>
  </defs>
  <rect width="1600" height="1000" fill="url(#bg)"/>
  <g fill="#c9d2d8" transform="translate(1000 0)">
    <circle cx="0" cy="430" r="140"/>
    <path d="M-290 1000c0-200 130-335 290-335s290 135 290 335z"/>
  </g>
</svg>`;
await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log(out);
