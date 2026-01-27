// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';


// Detectăm mediul pentru a NU încărca Keystatic în producție
const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  // URL-ul canonic principal al site-ului
  // Rămâne GitHub Pages ca fallback stabil
  site: 'https://aurelianepuras.github.io/',

  integrations: [
    tailwind(),
    react(),
   markdoc({ allowHTML: true }),

    // Keystatic este activ DOAR în development
    // În producție este exclus complet
    ...(!isProduction ? [keystatic()] : []),

    sitemap()
  ],

  output: 'static',

  /**
   * VITE – Stabilizare dependency optimizer
   *
   * Motiv:
   * Vite încearcă să pre-compileze unele pachete care NU sunt
   * gândite pentru browser runtime (Markdoc, tooling intern).
   * Acest lucru produce warning-uri de tip:
   * "optimize deps" / "missing chunk" / "missing sourcemap".
   *
   * Soluție:
   * Excludem explicit doar pachetele care NU trebuie optimizate.
   *
   * Important:
   * - Se aplică DOAR în development
   * - Nu afectează build-ul final
   * - Nu afectează SEO
   * - Nu afectează GitHub Pages
   */
  vite: {
    optimizeDeps: {
      exclude: [
        '@markdoc/markdoc'
      ]
    }
  }
});

// ⚠️ VARIANTĂ VECHE – DEZACTIVATĂ
// Motiv: Vite genera warning-uri legate de dep optimizer
// și chunk-uri lipsă (.vite/deps).
// Această variantă excludea și Markdoc din optimizeDeps,
// ceea ce NU este necesar și poate crea confuzie.
//
// export default defineConfig({
//   site: 'https://aurelianepuras.github.io/',
//   integrations: [
//     tailwind(),
//     react(),
//     markdoc(),
//     ...(!isProduction ? [keystatic()] : []),
//     sitemap()
//   ],
//   output: 'static',
//
//   vite: {
//     optimizeDeps: {
//       exclude: [
//         'keystatic',
//         '@keystatic/core',
//         '@markdoc/markdoc'
//       ]
//     }
//   }
// });