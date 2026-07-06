import sharp from 'sharp';
import { readdirSync, statSync, writeFileSync, mkdirSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const reelsDir = join(__dirname, '..', 'public', 'reels');
const files = readdirSync(reelsDir).filter(f => extname(f).toLowerCase() === '.webp');

async function main() {
  let totalSaved = 0;
  let totalOriginal = 0;

  for (const file of files) {
    const input = join(reelsDir, file);

    try {
      const originalSize = statSync(input).size;
      const img = sharp(input);
      const meta = await img.metadata();

      const width = meta.width > 800 ? 800 : undefined;
      const buf = await img
        .resize(width, undefined, { withoutEnlargement: true })
        .webp({ quality: 70, effort: 4 })
        .toBuffer();

      const newSize = buf.length;
      const saved = originalSize - newSize;
      totalSaved += saved;
      totalOriginal += originalSize;
      const pct = ((saved / originalSize) * 100).toFixed(1);

      // Write compressed to a new file alongside the original
      const dir = join(reelsDir, 'opt');
      const outPath = join(dir, file);
      try { mkdirSync(dir); } catch {}
      writeFileSync(outPath, buf);

      console.log(`${file}: ${(originalSize / 1024).toFixed(0)}KB → ${(newSize / 1024).toFixed(0)}KB (${pct}%)`);
    } catch (err) {
      console.error(`${file}: ${err.message}`);
    }
  }

  if (totalOriginal > 0) {
    const totalPct = ((totalSaved / totalOriginal) * 100).toFixed(1);
    console.log(`\nTotal: ${(totalOriginal / 1024 / 1024).toFixed(1)}MB → ${((totalOriginal - totalSaved) / 1024 / 1024).toFixed(1)}MB (${totalPct}% saved)`);
  }
}

main().catch(console.error);
