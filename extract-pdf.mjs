import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

const pdfPath = 'vibe.pdf';
const data = new Uint8Array(readFileSync(pdfPath));

const pdf = await getDocument({ data, useSystemFonts: true }).promise;
console.log(`PDF has ${pdf.numPages} pages`);

mkdirSync('images', { recursive: true });

// Try to extract embedded images from each page's operatorList
for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
  const page = await pdf.getPage(pageNum);
  const ops = await page.getOperatorList();

  const viewport = page.getViewport({ scale: 1 });
  console.log(`Page ${pageNum}: ${Math.round(viewport.width)}x${Math.round(viewport.height)} - ops count: ${ops.fnArray.length}`);

  // Look for image operations
  const OPS = {
    paintImageXObject: 85,
    paintInlineImageXObject: 86,
    paintImageMaskXObject: 84,
  };

  const imageKeys = new Set();
  for (let i = 0; i < ops.fnArray.length; i++) {
    if (ops.fnArray[i] === OPS.paintImageXObject) {
      imageKeys.add(ops.argsArray[i][0]);
    }
  }

  console.log(`  Found image refs:`, [...imageKeys]);

  for (const key of imageKeys) {
    try {
      const img = await page.objs.get(key);
      if (img && img.data) {
        console.log(`  Image ${key}: ${img.width}x${img.height}, kind=${img.kind}`);
        // kind 1 = grayscale, 2 = RGB, 3 = RGBA
        const channels = img.kind === 3 ? 4 : img.kind === 2 ? 3 : 1;
        const pixels = img.data;
        // Write raw PPM for RGB
        if (channels >= 3) {
          const header = `P6\n${img.width} ${img.height}\n255\n`;
          const buf = Buffer.alloc(img.width * img.height * 3);
          for (let i = 0; i < img.width * img.height; i++) {
            buf[i*3]   = pixels[i*channels];
            buf[i*3+1] = pixels[i*channels+1];
            buf[i*3+2] = pixels[i*channels+2];
          }
          writeFileSync(`images/page${pageNum}_${key}.ppm`, Buffer.concat([Buffer.from(header), buf]));
          console.log(`  Saved images/page${pageNum}_${key}.ppm`);
        }
      }
    } catch(e) {
      console.log(`  Could not get ${key}:`, e.message);
    }
  }
}
