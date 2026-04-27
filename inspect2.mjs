import { readFileSync } from 'fs';

function inspect(file, label) {
  const buf = readFileSync(file);
  const pixelStart = 17;
  const width = 1080, height = 1920;
  const raw = buf.slice(pixelStart);

  console.log(`\n=== ${label} ===`);

  // Sample a grid of interior pixels
  const rows = [100, 200, 400, 600, 800, 960, 1100, 1400, 1700, 1800];
  const cols = [100, 300, 540, 700, 900];

  for (const r of rows) {
    const samples = cols.map(c => {
      const i = (r * width + c) * 3;
      return `(${raw[i]},${raw[i+1]},${raw[i+2]})`;
    });
    console.log(`  row ${r}: ${samples.join('  ')}`);
  }
}

inspect('images/page1_img_p0_1.ppm', 'Hero/Page1');
inspect('images/page2_img_p1_1.ppm', 'Graffiti/Page2');
