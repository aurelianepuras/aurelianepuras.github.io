# Site Aurelian Epuraș
<!-- readme creat de cursor -->

Site-ul personal al lui Aurelian Epuraș - Pianist, Compozitor, Profesor.

## 🚀 Tehnologii

- [Astro](https://astro.build) - Framework pentru site-uri statice
- [React](https://react.dev) - Biblioteca UI pentru componente interactive
- [Tailwind CSS](https://tailwindcss.com) - Framework CSS utilitar
- [Keystatic](https://keystatic.com) - CMS headless pentru gestionarea conținutului
- [TypeScript](https://www.typescriptlang.org) - Superset JavaScript cu tipuri

## 📦 Instalare

```bash
npm install
```

## 🧞 Comenzi

Toate comenzile sunt rulate din rădăcina proiectului:

| Comandă                   | Acțiune                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Instalează dependențele                          |
| `npm run dev`             | Pornește serverul de dezvoltare la `localhost:4321` |
| `npm run build`           | Construiește site-ul pentru producție în `./dist/` |
| `npm run preview`         | Preview al build-ului local, înainte de deploy   |
| `npm run astro ...`       | Rulează comenzi CLI precum `astro add`, `astro check` |

## 📁 Structura Proiectului

```
/
├── public/
│   ├── uploads/          # Imagini, audio, video
│   └── favicon.svg
├── src/
│   ├── components/       # Componente reutilizabile
│   ├── content/          # Conținut (blog, galerie, video, audio)
│   ├── layouts/          # Layout-uri pentru pagini
│   ├── pages/            # Pagini ale site-ului
│   └── scripts/          # Script-uri JavaScript
├── astro.config.mjs      # Configurația Astro
├── tailwind.config.mjs   # Configurația Tailwind CSS
└── package.json
```

## 🌐 Deploy

Site-ul este configurat pentru deploy static și poate fi hostat pe orice platformă de hosting static (GitHub Pages, Netlify, Vercel, etc.).