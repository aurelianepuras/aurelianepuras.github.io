// @ts-check
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import markdoc from '@astrojs/markdoc';
import keystatic from '@keystatic/astro';
import sitemap from '@astrojs/sitemap';

const isProduction = process.env.NODE_ENV === 'production';

export default defineConfig({
  site: 'https://aurelianepuras.github.io/',
  integrations: [
    tailwind(),
    react(),
    markdoc(),
    ...(!isProduction ? [keystatic()] : []),
    sitemap()
  ],
  output: 'static'
});
