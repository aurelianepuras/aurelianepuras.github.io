/** Calea miniaturii WebP generate de scripts/generate-thumbs.mjs pentru o imagine din /uploads/images. */
export function thumb(src?: string | null): string | undefined {
  if (!src || !src.startsWith('/uploads/images/')) return undefined;
  if (!/\.(jpe?g|png)$/i.test(src)) return undefined;
  return src.replace('/uploads/images/', '/uploads/thumbs/').replace(/\.(jpe?g|png)$/i, '.webp');
}
