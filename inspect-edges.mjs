import { readFileSync } from 'fs';
import sharp from 'sharp';

async function inspect(file, label) {
  console.log(`\n=== ${label} ===`);
  const buf = readFileSync(file);
  const pixelStart = 17; // P6\n + "1080 1920\n" + "255\n" = 3+10+4 = 17
  const width = 1080, height = 1920;
  const raw = buf.slice(pixelStart);
  console.log(`raw bytes: ${raw.length}, expected: ${width*height*3}`);

  // Sample edges
  const corners = [
    { name: 'top-left',     r: 0,         c: 0 },
    { name: 'top-right',    r: 0,         c: width-1 },
    { name: 'bottom-left',  r: height-1,  c: 0 },
    { name: 'bottom-right', r: height-1,  c: width-1 },
    { name: 'top-mid',      r: 0,         c: width>>1 },
    { name: 'bottom-mid',   r: height-1,  c: width>>1 },
    { name: 'left-mid',     r: height>>1, c: 0 },
    { name: 'right-mid',    r: height>>1, c: width-1 },
  ];
  for (const { name, r, c } of corners) {
    const i = (r * width + c) * 3;
    console.log(`  ${name}: R=${raw[i]} G=${raw[i+1]} B=${raw[i+2]}`);
  }

  // Scan top rows
  console.log('\n  Top 5 rows avg color:');
  for (let row = 0; row < 5; row++) {
    let rSum=0,gSum=0,bSum=0;
    for (let col = 0; col < width; col++) {
      const i = (row*width+col)*3;
      rSum+=raw[i]; gSum+=raw[i+1]; bSum+=raw[i+2];
    }
    console.log(`    row ${row}: avg R=${Math.round(rSum/width)} G=${Math.round(gSum/width)} B=${Math.round(bSum/width)}`);
  }
}

await inspect('images/page1_img_p0_1.ppm', 'Hero (page 1)');
await inspect('images/page2_img_p1_1.ppm', 'Graffiti (page 2)');
