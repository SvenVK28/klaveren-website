import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { WORK_TYPE_KEYS } from './lib/work-types';

// The CMS (public/admin/config.yml) writes these files, so the schemas below
// must stay in sync with the fields defined there. Keep them lenient: a failed
// build means the site silently stops updating for the editor.

/** Treat empty values the CMS may write ('' / null) as "not set". */
const empty = (value: unknown) => (value === '' || value === null ? undefined : value);
const optionalText = z.preprocess(empty, z.string().optional());
const optionalList = <T extends z.ZodType>(item: T) =>
  z.preprocess((value) => empty(value) ?? [], z.array(item));

const work = defineCollection({
  // One folder per production: src/content/work/<slug>/index.md + its photos.
  loader: glob({ pattern: '*/index.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      type: z.enum(WORK_TYPE_KEYS).catch('overig'),
      summary: optionalText,
      cover: z.preprocess(empty, image().optional()),
      cover_alt: optionalText,
      cover_credit: optionalText,
      media_url: optionalText,
      publication: optionalText,
      external_url: optionalText,
      context: optionalText,
      credits: optionalText,
      tags: optionalList(z.string()),
      gallery: optionalList(
        z.object({
          image: image(),
          caption: optionalText,
        }),
      ),
      attachments: optionalList(
        z.object({
          file: z.string(),
          label: optionalText,
        }),
      ),
      featured: z.boolean().default(false),
      draft: z.boolean().default(false),
    }),
});

const settings = defineCollection({
  loader: glob({ pattern: 'settings.yaml', base: './src/content/site' }),
  schema: z.object({
    name: z.string(),
    tagline: optionalText,
    description: optionalText,
    email: optionalText,
    socials: optionalList(
      z.object({
        platform: z.string(),
        url: z.string(),
      }),
    ),
    cv: optionalText,
  }),
});

const home = defineCollection({
  loader: glob({ pattern: 'home.yaml', base: './src/content/site' }),
  schema: z.object({
    headline: z.string(),
    intro: optionalText,
  }),
});

const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content/site' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().default('Over mij'),
      photo: z.preprocess(empty, image().optional()),
      photo_alt: optionalText,
      intro: optionalText,
    }),
});

export const collections = { work, settings, home, about };
