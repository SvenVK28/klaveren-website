// Turns the logo files the owner supplied (flat PNGs on a white background,
// kept in docs/design/logo/) into the web assets the site uses:
//   src/assets/brand/logo-navy.png, logo-black.png  transparent, trimmed
//   public/favicon.png, apple-touch-icon.png        the K with the microphone
//   public/og-default.png                           share image (1200x630)
//
// The letterforms are not redrawn: every pixel comes from the supplied file.
// Only the white background is made transparent, by treating each pixel as the
// ink colour blended with white. Run again after the owner supplies a new logo:
//   node scripts/brand/prepare-logo.mjs
import sharp from 'sharp';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../../', import.meta.url));
const src = (name) => `${root}docs/design/logo/${name}`;

/** Make the white background transparent; returns raw RGBA plus size. */
async function knockOutWhite(file) {
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  // Ink colour = median of the darkest pixels.
  const lum = [];
  for (let i = 0; i < data.length; i += 3) lum.push([data[i] + data[i + 1] + data[i + 2], i]);
  lum.sort((a, b) => a[0] - b[0]);
  const darkest = lum.slice(0, Math.floor(lum.length * 0.02)).map(([, i]) => i);
  const channel = (c) => darkest.map((i) => data[i + c]).sort((a, b) => a - b)[darkest.length >> 1];
  const ink = [channel(0), channel(1), channel(2)];

  const out = Buffer.alloc(width * height * 4);
  for (let p = 0, q = 0; p < data.length; p += 3, q += 4) {
    // Coverage per channel relative to the ink colour, averaged.
    let a = 0;
    for (let c = 0; c < 3; c++) a += (255 - data[p + c]) / Math.max(1, 255 - ink[c]);
    a = Math.min(1, Math.max(0, a / 3));
    if (a < 0.06) a = 0; // paper noise
    // Keep the original colour where the pixel is mostly ink (e.g. the lighter
    // blue lines in the colour logo), the ink colour on anti-aliased edges.
    const keep = a > 0.85;
    for (let c = 0; c < 3; c++) out[q + c] = keep ? data[p + c] : ink[c];
    out[q + 3] = Math.round(a * 255);
  }
  return { out, width, height, ink };
}

/** Bounding box of visible pixels. */
function bbox({ out, width, height }) {
  let x0 = width, y0 = height, x1 = 0, y1 = 0;
  for (let y = 0; y < height; y++)
    for (let x = 0; x < width; x++)
      if (out[(y * width + x) * 4 + 3] > 24) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
  return { left: x0, top: y0, width: x1 - x0 + 1, height: y1 - y0 + 1 };
}

const raw = (img) => sharp(img.out, { raw: { width: img.width, height: img.height, channels: 4 } });

async function logo(name, target) {
  const img = await knockOutWhite(src(name));
  const box = bbox(img);
  const pad = 8;
  const region = {
    left: Math.max(0, box.left - pad),
    top: Math.max(0, box.top - pad),
    width: Math.min(img.width - box.left + pad, box.width + 2 * pad),
    height: Math.min(img.height - box.top + pad, box.height + 2 * pad),
  };
  await raw(img).extract(region).png({ compressionLevel: 9, palette: false }).toFile(`${root}src/assets/brand/${target}`);
  console.log(target, region, 'ink', img.ink);
  return { img, box };
}

const navy = await logo('scvk-media-logo-navy.png', 'logo-navy.png');
await logo('scvk-media-logo-black.png', 'logo-black.png');

// Favicon: the K with the microphone, the logo's most distinctive part. It sits
// in the right part of the letters row; find it from the trimmed box.
{
  const { img, box } = navy;
  const kLeft = box.left + Math.round(box.width * 0.712);
  const top = box.top;
  const bottom = box.top + Math.round(box.height * 0.78); // above the "MEDIA" line
  const region = { left: kLeft, top, width: box.left + box.width - kLeft, height: bottom - top };
  const k = await raw(img).extract(region).png().toBuffer();
  const meta = await sharp(k).trim({ threshold: 10 }).toBuffer({ resolveWithObject: true });
  for (const [file, size, background] of [
    ['favicon.png', 64, { r: 0, g: 0, b: 0, alpha: 0 }],
    ['apple-touch-icon.png', 180, { r: 255, g: 255, b: 255, alpha: 1 }],
  ]) {
    const inner = Math.round(size * (background.alpha ? 0.72 : 0.94));
    const glyph = await sharp(meta.data).resize(inner, inner, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } }).toBuffer();
    await sharp({ create: { width: size, height: size, channels: 4, background } })
      .composite([{ input: glyph, gravity: 'centre' }])
      .png()
      .toFile(`${root}public/${file}`);
    console.log(file, size);
  }
}

// Default share image: the logo centred on white.
{
  const logoPng = await sharp(`${root}src/assets/brand/logo-navy.png`).resize({ width: 760 }).toBuffer();
  await sharp({ create: { width: 1200, height: 630, channels: 4, background: '#ffffff' } })
    .composite([{ input: logoPng, gravity: 'centre' }])
    .flatten({ background: '#ffffff' })
    .png()
    .toFile(`${root}public/og-default.png`);
  console.log('og-default.png 1200x630');
}
