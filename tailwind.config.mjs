/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        ivory: {
          DEFAULT: '#F7F5F0',
          light: '#EDE9E0',
          card: '#F3F0E8',
        },
        navy: {
          DEFAULT: '#1E2433',
          deep: '#161A24',
          card: '#1F232F',
        },
        gold: {
          warm: '#C4A035',
          bright: '#D4AF37',
        },
      },
      fontFamily: {
        serif: ['EB Garmond', 'serif'],
        sans: ['DM Sans', 'sans-serif'],
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
