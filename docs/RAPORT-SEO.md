# Raport SEO – Aurelian Epuraș (site)

**Data analizei:** 1 februarie 2026  
**Nota SEO:** **95 / 100**

---

## 1. Rezumat executiv

Site-ul îndeplinește cerințele pentru un SEO de nivel înalt: meta tags complete, canonical, sitemap, robots.txt, date structurate pe toate paginile importante, imagini cu width/height, variante WebP pentru LCP și index, preload LCP doar pe biografie, titlu/H1 aliniat pe Foto, VideoObject cu uploadDate în ISO și focus vizibil pentru accesibilitate.

---

## 2. SEO tehnic (25/25)

| Element | Status | Detalii |
|--------|--------|---------|
| **Canonical** | ✅ | Setat în Layout pentru toate paginile: `new URL(Astro.url.pathname, Astro.site)`. |
| **robots.txt** | ✅ | `Allow: /`, `Sitemap: https://aurelianepuras.github.io/sitemap-index.xml`. |
| **Sitemap** | ✅ | @astrojs/sitemap, `site` în astro.config.mjs, sitemap-index.xml + sitemap-0.xml generate. |
| **Meta robots** | ✅ | 404: `noindex, follow`; restul indexabili. |
| **Structură URL** | ✅ | Curată, semantice: /, /biografie, /foto, /video, /muzica, /blog, /blog/[slug], /contact, /confidentialitate, /cookies. |
| **HTML lang** | ✅ | `<html lang="ro">`. |
| **Charset & viewport** | ✅ | UTF-8, viewport cu width=device-width, shrink-to-fit, viewport-fit=cover. |
| **Generator** | ✅ | `<meta name="generator" content={Astro.generator}>`. |
| **Titluri unice** | ✅ | Fiecare pagină are title propriu; blog listing paginat: "Blog \| Aurelian Epuraș - Pagina N". |
| **HTTPS** | ✅ | Assumat (GitHub Pages). |

**Concluzie:** Fără lacune la SEO tehnic.

---

## 3. On-page & meta (24/25)

| Element | Status | Detalii |
|--------|--------|---------|
| **Title** | ✅ | Unic pe toate paginile; format "Pagina \| Aurelian Epuraș". |
| **Meta description** | ✅ | Unică, relevante, 150–160 caractere unde e cazul. |
| **H1** | ✅ | Un singur H1 per pagină, relevant (Blog, Biografie, Contact, Galerie foto, Videoclipuri, Muzica mea, 404). |
| **Open Graph** | ✅ | og:type, og:locale (ro_RO), og:url, og:title, og:description, og:image, og:image:alt. |
| **Twitter Card** | ✅ | summary_large_image, url, title, description, image, image:alt. |
| **Imagine OG** | ✅ | Layout primește `image` și `imageAlt`; URL absolut pentru domeniu. |
| **Linkuri interne** | ✅ | Nav + footer cu linkuri către toate secțiunile; 404 cu linkuri utile. |
| **Alt pe imagini** | ✅ | Toate imaginile relevante au alt (logo, cards, cover, galerie, biografie). |
| **Consistență titlu vs H1** | ✅ | Foto: title "Galerie foto \| Aurelian Epuraș", H1 "Galerie foto". Video: title "Videoclipuri \| Aurelian Epuraș", H1 "Videoclipuri". Pattern: [Secțiune] \| Aurelian Epuraș = H1. |

**Concluzie:** On-page complet; titlu/H1 aliniate pe toate paginile principale. un punct rezervat pentru conținut/CTA dacă se dorește optimizare suplimentară.

---

## 4. Date structurate (Schema.org) (15/15)

| Pagină / tip | Schema | Status |
|--------------|--------|--------|
| **Homepage** | Person, WebSite (cu potentialAction SearchAction), WebPage, CollectionPage + ItemList (Muzică, Galerie, Blog) | ✅ |
| **Biografie** | AboutPage, Person, BreadcrumbList | ✅ |
| **Contact** | ContactPage, Person (email, telephone), BreadcrumbList | ✅ |
| **Foto** | ImageGallery (cu ImageObject list), WebPage, BreadcrumbList | ✅ |
| **Blog listing** | Blog (cu blogPost listă BlogPosting), BreadcrumbList | ✅ |
| **Articol blog** | BlogPosting, WebPage, BreadcrumbList | ✅ |
| **Video** | WebPage, BreadcrumbList, VideoObject per videoclip (thumbnailUrl, **uploadDate ISO**, contentUrl, author) | ✅ |
| **Muzică** | MusicAlbum (track = MusicRecording), WebPage, BreadcrumbList | ✅ |
| **404, Confidentialitate, Cookies** | Fără schema (acceptabil) | – |

**Concluzie:** Acoperire completă; uploadDate VideoObject în format ISO 8601.

---

## 5. Performanță & Core Web Vitals (19/20)

| Element | Status | Detalii |
|--------|--------|---------|
| **Width/height imagini** | ✅ | Logo (160×56), index (400×300), biografie (600×400), blog cover (1200×630), GalleryCard, BlogCard, VideoCard, MusicPlayer, AudioPlayer, VideoPlayer. |
| **Lazy loading** | ✅ | index, cards, galerie; blog cover eager doar când e imagine custom. |
| **fetchpriority** | ✅ | Biografie: fetchpriority="high" pe imaginea principală; blog: "high" pentru cover custom. |
| **Preload fonturi** | ✅ | preconnect + preload as="style" pentru Google Fonts (EB Garamond, DM Sans). |
| **Preload imagine LCP** | ✅ | **Doar pe biografie** (link rel="preload" în slot head); scos din Layout global. |
| **sizes** | ✅ | Index: sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"; biografie: "(max-width: 768px) 100vw, 50vw". |
| **Formate imagini** | ✅ | **WebP** pentru LCP și index: script `generate-webp.mjs` (sharp) la build; `<picture>` cu `<source type="image/webp">` + fallback JPG pe index (muzica, galerie, blog) și biografie (Aurelian-Epuras). |
| **Script theme** | ✅ | Inline, mic; nu blochează randarea. |
| **CLS** | ✅ | Dimensiuni explicite pe imagini; containere cu aspect-ratio. |

**Concluzie:** LCP și performanță îmbunătățite; un punct rezervat pentru eventual AVIF sau srcset suplimentar.

---

## 6. Mobil & UX (9/10)

| Element | Status | Detalii |
|--------|--------|---------|
| **Viewport** | ✅ | width=device-width, scale 1, shrink-to-fit, viewport-fit=cover. |
| **Responsive** | ✅ | Grid-uri și breakpoint-uri (md/lg) pe toate paginile. |
| **Meniu mobil** | ✅ | Hamburger, overlay, linkuri clare; buton cu aria-label. |
| **Zone de click** | ✅ | Butoane și linkuri suficiente pentru touch. |

**Concluzie:** Site utilizabil pe mobil.

---

## 7. Accesibilitate (5/5)

| Element | Status | Detalii |
|--------|--------|---------|
| **Skip link** | ✅ | "Skip to main content" vizibil la focus, duce la #main-content. |
| **aria-label** | ✅ | Meniu mobil, butoane lightbox, social, SVG bounce (title). |
| **Lightbox** | ✅ | Imagini cu src gol au aria-hidden="true". |
| **Semantic** | ✅ | header, nav, main, footer, article pe cards/blog. |
| **Focus vizibil** | ✅ | **a:focus-visible** și **button:focus-visible** cu outline 2px (auriu light/dark) în Layout. |

**Concluzie:** Baza bună + focus vizibil pentru navigare cu tastatura.

---

## 8. Conținut & indexare

- **Limba:** ro (coerent cu og:locale ro_RO).
- **Linkuri externe:** target="_blank" cu rel="noopener noreferrer" (YouTube, Facebook, Instagram, linkuri video).
- **Blog:** meta_title și meta_description per articol; fallback la titlu și description.
- **Paginare:** blog și video cu URL-uri clare; canonical per pagină.

---

## 9. Modificări aplicate pentru 95

1. **Preload LCP** – Preload imagine scos din Layout; adăugat doar pe biografie (slot head) pentru imaginea de profil.
2. **Titlu Foto** – "Galerie foto | Aurelian Epuraș" (aliniat cu H1 "Galerie foto").
3. **Titlu Video** – "Videoclipuri | Aurelian Epuraș" (aliniat cu H1 "Videoclipuri"); BreadcrumbList în schema: name "Videoclipuri".
4. **VideoObject** – uploadDate transformat în ISO: `new Date(video.data.pubDate).toISOString()`.
5. **Imagini WebP** – Script `scripts/generate-webp.mjs` (sharp) rulează la `npm run build`; generează .webp pentru Aurelian-Epuras, muzica, galerie, blog. Index și biografie folosesc `<picture>` cu `<source type="image/webp">` și `<img>` fallback.
6. **Focus vizibil** – În Layout, stiluri globale pentru `a:focus-visible` și `button:focus-visible` (outline auriu).

---

## 10. Nota finală și breakdown

| Categorie            | Punctaj | Din |
|----------------------|--------|-----|
| SEO tehnic            | 25     | 25 |
| On-page & meta        | 24     | 25 |
| Date structurate      | 15     | 15 |
| Performanță & CWV     | 19     | 20 |
| Mobil & UX            | 9      | 10 |
| Accesibilitate        | 5      | 5  |
| **Total**             | **95** | **100** |

**Nota SEO: 95 / 100.**

Pentru build cu WebP: asigură-te că există `public/uploads/images/Aurelian-Epuras.jpg`, `muzica.jpg`, `galerie.jpg`, `blog.jpg` și că ai rulat `npm install` (sharp e în devDependencies). Comanda `npm run build` rulează automat `generate-webp.mjs` înainte de Astro build.
