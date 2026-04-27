import sharp from 'sharp';
import { readFileSync } from 'fs';

// Page 1 = grayscale graffiti → questions page
// Page 2 = dark blue         → hero/landing page
const FILES = [
  { ppm: 'images/page1_img_p0_1.ppm', jpg: 'images/graffiti-bg.jpg', w: 1080, h: 1920 },
  { ppm: 'images/page2_img_p1_1.ppm', jpg: 'images/hero-bg.jpg',     w: 1080, h: 1920 },
];

const PPM_HEADER = 17; // "P6\n1080 1920\n255\n" = 17 bytes

for (const { ppm, jpg, w, h } of FILES) {
  const buf = readFileSync(ppm);
  const raw = buf.slice(PPM_HEADER);
  console.log(`${ppm}: raw=${raw.length} expected=${w*h*3}`);

  await sharp(raw, { raw: { width: w, height: h, channels: 3 } })
    .jpeg({ quality: 90 })
    .toFile(jpg);

  const meta = await sharp(jpg).metadata();
  console.log(`  → ${jpg} (${meta.width}x${meta.height})`);
}
