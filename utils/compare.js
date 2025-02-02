import { readFileSync, writeFileSync } from 'fs';
import { PNG } from 'pngjs';

const pixelmatch = (await import('pixelmatch')).default;

export async function compareImages(imgPath1, imgPath2, threshold, diffOutputPath = null) {
  const img1 = PNG.sync.read(readFileSync(imgPath1));
  const img2 = PNG.sync.read(readFileSync(imgPath2));

  if (img1.width !== img2.width || img1.height !== img2.height) {
    throw new Error('Images\' are different!');
  }

  const { width, height } = img1;
  const diff = new PNG({ width, height });

  const numDiffPixels = pixelmatch(
    img1.data,
    img2.data,
    diff.data,
    width,
    height,
    { threshold }
  );

  if (diffOutputPath) {
    writeFileSync(diffOutputPath, PNG.sync.write(diff));
  }

  return numDiffPixels;
}
