/**
 * Patch .astro/content-modules.mjs so that old flat blog paths (blog/slug.mdoc)
 * point to the actual files (blog/slug/index.mdoc). Astro content sync sometimes
 * generates entries for both; this redirects the old path imports to the new path.
 */
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
const contentModulesPath = join(__dirname, '..', '.astro', 'content-modules.mjs');

let content;
try {
  content = readFileSync(contentModulesPath, 'utf8');
} catch (err) {
  console.warn('patch-content-modules: .astro/content-modules.mjs not found, skipping');
  process.exit(0);
}

// Redirect flat blog path imports to slug/index.mdoc (e.g. blog/albumul-13....mdoc -> blog/albumul-13.../index.mdoc)
// Only match flat paths (blog/slug.mdoc): slug must not contain %2F (no encoded slash = no subdir)
const oldFlatPath = /(fileName=)(src%2Fcontent%2Fblog%2F)([^%]+)(\.mdoc)/g;
content = content.replace(oldFlatPath, (full) => {
  if (full.includes('%2Findex.mdoc')) return full; // already slug/index.mdoc
  const match = full.match(/(fileName=)(src%2Fcontent%2Fblog%2F)([^%]+)(\.mdoc)/);
  if (!match) return full;
  const [, prefix, blog, slug, ext] = match;
  return `${prefix}${blog}${slug}%2Findex${ext}`;
});

writeFileSync(contentModulesPath, content);
console.log('patch-content-modules: patched .astro/content-modules.mjs');
