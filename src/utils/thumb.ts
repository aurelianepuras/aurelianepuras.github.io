/** Calea miniaturii WebP generate de scripts/generate-thumbs.mjs pentru o imagine din /uploads/images. */
export function thumb(src?: string | null): string | undefined {
  if (!src || !src.startsWith('/uploads/images/')) return undefined;
  if (!/\.(jpe?g|png)$/i.test(src)) return undefined;
  return src.replace('/uploads/images/', '/uploads/thumbs/').replace(/\.(jpe?g|png)$/i, '.webp');
}

/** Varianta mare (1800px) generată doar pentru coperțile articolelor. */
export function large(src?: string | null): string | undefined {
  const t = thumb(src);
  return t && /\/cover_image\.webp$/.test(t) ? t.replace('/uploads/thumbs/', '/uploads/large/') : undefined;
}
