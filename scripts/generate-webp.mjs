#!/usr/bin/env node
/**
 * Generează variante WebP pentru imaginile LCP/hero din public/uploads/images.
 * Rulează înainte de build; dacă sharp sau fișierele lipsesc, iese fără eroare.
 */
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = join(__dirname, '..', 'public', 'uploads', 'images');
const names = ['Aurelian-Epuras', 'muzica', 'galerie', 'blog'];

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('[generate-webp] sharp nu e instalat; rulează: npm install -D sharp');
  process.exit(0);
}

for (const name of names) {
  const jpgPath = join(publicDir, `${name}.jpg`);
  const webpPath = join(publicDir, `${name}.webp`);
  if (!existsSync(jpgPath)) continue;
  try {
    const buf = readFileSync(jpgPath);
    const out = await sharp(buf)
      .webp({ quality: 82, effort: 4 })
      .toBuffer();
    writeFileSync(webpPath, out);
    console.log('[generate-webp]', `${name}.webp`);
  } catch (e) {
    console.warn('[generate-webp]', name, e.message);
  }
}
