import { config, fields, collection, singleton } from '@keystatic/core';

export default config({
  storage: {
    kind: 'local',
  },
  collections: {
   blog: collection({
      label: 'Blog',
      slugField: 'title',
      path: 'src/content/blog/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Titlu' } }),
        meta_title: fields.text({ label: 'Meta Title (SEO)' }),
        meta_description: fields.text({ label: 'Meta Description (SEO)', multiline: true }),
        description: fields.text({ label: 'Descriere', multiline: true }),
        // Folosim numele "date" pentru a fi compatibil cu fișierele tale vechi
        date: fields.datetime({ 
          label: 'Data și Ora Publicării', 
          defaultValue: { kind: 'now' } 
        }),
        cover_image: fields.image({
          label: 'Imagine Cover',
          directory: 'public/uploads/images',
          publicPath: '/uploads/images/',
        }),
        content: fields.markdoc({ label: 'Conținut', options: { image: { directory: 'public/uploads/images', publicPath: '/uploads/images/' } } }),
      },
    }),
    gallery: collection({
      label: 'Galerie Foto',
      slugField: 'title',
      path: 'src/content/gallery/*',
      schema: {
        title: fields.slug({ name: { label: 'Titlu' } }),
        pubDate: fields.datetime({ 
          label: 'Data și Ora Publicării', 
          defaultValue: { kind: 'now' } 
        }),
        image: fields.image({
          label: 'Imagine',
          directory: 'public/uploads/images',
          publicPath: '/uploads/images/',
        }),
        description: fields.text({ label: 'Descriere', multiline: true }),
      },
    }),
    videos: collection({
      label: 'Video',
      slugField: 'title',
      path: 'src/content/videos/*',
      schema: {
        title: fields.slug({ name: { label: 'Titlu' } }),
        pubDate: fields.datetime({ 
          label: 'Data și Ora Publicării', 
          defaultValue: { kind: 'now' } 
        }),
        meta_title: fields.text({ label: 'Meta Title (SEO)' }),
        meta_description: fields.text({ label: 'Meta Description (SEO)', multiline: true }),
        external_url: fields.url({ label: 'Link YouTube/Vimeo' }),
        thumbnail: fields.image({
          label: 'Thumbnail (local)',
          directory: 'public/uploads/thumbnails',
          publicPath: '/uploads/thumbnails/',
        }),
        description: fields.text({ label: 'Descriere', multiline: true }),
      },
    }),
    audio: collection({
      label: 'Muzică',
      slugField: 'title',
      path: 'src/content/audio/*',
      schema: {
        title: fields.slug({ name: { label: 'Titlu' } }),
        pubDate: fields.datetime({ 
          label: 'Data și Ora Publicării', 
          defaultValue: { kind: 'now' } 
        }),
        audio_file: fields.file({
          label: 'Fișier Audio (MP3)',
          directory: 'public/uploads/audio',
          publicPath: '/uploads/audio/',
        }),
        cover: fields.image({
          label: 'Cover Art',
          directory: 'public/uploads/images',
          publicPath: '/uploads/images/',
        }),
        description: fields.text({ label: 'Descriere', multiline: true }),
      },
    }),
  },
  singletons: {
    home: singleton({
      label: 'Pagina Home',
      path: 'src/content/pages/home',
      schema: {
        meta_title: fields.text({ label: 'Meta Title (SEO)' }),
        meta_description: fields.text({ label: 'Meta Description (SEO)', multiline: true }),
        hero_title: fields.text({ label: 'Hero Title', multiline: true }),
        hero_subtitle: fields.text({ label: 'Hero Subtitle', multiline: true }),
        hero_image: fields.image({
          label: 'Hero Image',
          directory: 'public/uploads/images',
          publicPath: '/uploads/images/',
        }),
      },
    }),
    biografie: singleton({
      label: 'Biografie',
      path: 'src/content/pages/biografie',
      schema: {
        meta_title: fields.text({ label: 'Meta Title (SEO)' }),
        meta_description: fields.text({ label: 'Meta Description (SEO)', multiline: true }),
        profile_photo: fields.image({
          label: 'Fotografie Profil',
          directory: 'public/uploads/images',
          publicPath: '/uploads/images/',
        }),
        content: fields.markdoc({ label: 'Conținut Biografie' }),
      },
    }),
    contact: singleton({
      label: 'Contact',
      path: 'src/content/pages/contact',
      schema: {
        meta_title: fields.text({ label: 'Meta Title (SEO)' }),
        meta_description: fields.text({ label: 'Meta Description (SEO)', multiline: true }),
        email: fields.text({ label: 'Email' }),
        phone: fields.text({ label: 'Telefon' }),
      },
    }),
    social: singleton({
      label: 'Social Media',
      path: 'src/content/pages/social',
      schema: {
        youtube: fields.url({ label: 'YouTube URL' }),
        facebook: fields.url({ label: 'Facebook URL' }),
        instagram: fields.url({ label: 'Instagram URL' }),
      },
    }),
  },
});