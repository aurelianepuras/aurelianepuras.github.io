import { defineCollection, z } from 'astro:content';

const blog = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    description: z.string().optional(),
    author: z.string().default('Aurelian Epuraș'),
    date: z.date(),
    cover_image: z.string().optional(),
  }),
});

const gallery = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    image: z.string(),
    description: z.string().optional(),
  }),
});

const videos = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    meta_title: z.string().optional(),
    meta_description: z.string().optional(),
    external_url: z.string().url(),
    thumbnail: z.string().optional(),
    description: z.string().optional(),
  }),
});

const audio = defineCollection({
  type: 'data',
  schema: z.object({
    title: z.string(),
    audio_file: z.string(),
    cover: z.string().optional(),
    description: z.string().optional(),
    duration: z.string().optional(),
  }),
});

export const collections = {
  blog,
  gallery,
  videos,
  audio,
};
