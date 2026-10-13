#!/usr/bin/env node
/**
 * Generează miniaturi WebP (max 900px lățime) pentru toate imaginile din
 * public/uploads/images, în public/uploads/thumbs (aceeași structură, extensia .webp).
 * Galeria, coperțile și cardurile de blog le folosesc în loc de originalele grele.
 * Sare peste fișierele deja generate și mai noi decât originalul.
 */
import { readdirSync, statSync, mkdirSync, existsSync } from 'fs';
import { join, dirname, relative, extname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const srcDir = join(__dirname, '..', 'public', 'uploads', 'images');
const outDir = join(__dirname, '..', 'public', 'uploads', 'thumbs');
const exts = new Set(['.jpg', '.jpeg', '.png']);

let sharp;
try {
  sharp = (await import('sharp')).default;
} catch {
  console.warn('[generate-thumbs] sharp nu e instalat; rulează: npm install -D sharp');
  process.exit(0);
}

function* walk(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) yield* walk(p);
    else if (exts.has(extname(name).toLowerCase())) yield p;
  }
}

let made = 0;
for (const file of walk(srcDir)) {
  const rel = relative(srcDir, file);
  const out = join(outDir, rel.slice(0, -extname(rel).length) + '.webp');
  if (existsSync(out) && statSync(out).mtimeMs >= statSync(file).mtimeMs) continue;
  mkdirSync(dirname(out), { recursive: true });
  try {
    await sharp(file).rotate().resize({ width: 900, withoutEnlargement: true }).webp({ quality: 78, effort: 4 }).toFile(out);
    made++;
  } catch (e) {
    console.warn('[generate-thumbs]', rel, e.message);
  }
}
console.log(`[generate-thumbs] ${made} miniaturi noi`);
