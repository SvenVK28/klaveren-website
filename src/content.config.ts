import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { ICON_KEYS } from './lib/icons';
import { LEGACY_WORK_TYPES, PROJECT_TYPE_KEYS, WORK_TYPE_KEYS } from './lib/work-types';

// The CMS (public/admin/config.yml) writes these files, so the schemas below
// must stay in sync with the fields defined there. Keep them lenient: a failed
// build means the site silently stops updating for the editor.

/** Treat empty values the CMS may write ('' / null) as "not set". */
const empty = (value: unknown) => (value === '' || value === null ? undefined : value);
const optionalText = z.preprocess(empty, z.string().optional());
const textOr = (fallback: string) => z.preprocess(empty, z.string().default(fallback));
const optionalList = <T extends z.ZodType>(item: T) =>
  z.preprocess((value) => empty(value) ?? [], z.array(item));
const icon = z.preprocess(empty, z.enum(ICON_KEYS).optional()).catch(undefined);

/** A closing call-to-action band ("Een opdracht bespreken? → Neem contact op"). */
const cta = (image: SchemaContext['image']) =>
  z.preprocess(
    (value) => empty(value) ?? {},
    z.object({
      title: optionalText,
      text: optionalText,
      button: optionalText,
      image: z.preprocess(empty, image().optional()),
    }),
  );

const work = defineCollection({
  // One folder per project: src/content/work/<slug>/index.md + its photos.
  loader: glob({ pattern: '*/index.md', base: './src/content/work' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      date: z.coerce.date(),
      show_date: z.boolean().default(true),
      type: z.preprocess(
        (value) => (typeof value === 'string' ? (LEGACY_WORK_TYPES[value] ?? value) : value),
        z.enum(WORK_TYPE_KEYS).catch('overig'),
      ),
      summary: optionalText,
      cover: z.preprocess(empty, image().optional()),
      cover_alt: optionalText,
      cover_credit: optionalText,
      role: optionalText,
      project_type: z.preprocess(empty, z.enum(PROJECT_TYPE_KEYS).optional()).catch(undefined),
      context: optionalText,
      publication: optionalText,
      external_url: optionalText,
      media_url: optionalText,
      credits: optionalText,
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
    name: textOr('SCVK Media'),
    owner: textOr('Sven van Klaveren'),
    description: optionalText,
    email: optionalText,
    socials: optionalList(
      z.object({
        platform: z.string(),
        url: z.string(),
      }),
    ),
    form_key: optionalText,
    preview: z.boolean().default(false),
    project_cta: z.preprocess(
      (value) => empty(value) ?? {},
      z.object({ eyebrow: optionalText, title: optionalText, text: optionalText, button: optionalText }),
    ),
  }),
});

const home = defineCollection({
  loader: glob({ pattern: 'home.md', base: './src/content/site' }),
  schema: ({ image }) =>
    z.object({
      description: optionalText,
      eyebrow: optionalText,
      headline: z.string(),
      intro: optionalText,
      primary_button: textOr('Bekijk mijn werk'),
      secondary_button: textOr('Bespreek een opdracht'),
      hero_image: z.preprocess(empty, image().optional()),
      hero_image_alt: optionalText,
      work_eyebrow: optionalText,
      work_title: textOr('Een greep uit mijn werk'),
      work_count: z.preprocess(empty, z.coerce.number().int().min(1).max(12).default(6)).catch(6),
      about_eyebrow: optionalText,
      about_title: optionalText,
      about_text: optionalText,
      about_photo: z.preprocess(empty, image().optional()),
      about_photo_alt: optionalText,
      services_eyebrow: optionalText,
      services_title: textOr('Wat ik voor je kan doen'),
      cta: cta(image),
    }),
});

const about = defineCollection({
  loader: glob({ pattern: 'about.md', base: './src/content/site' }),
  schema: ({ image }) =>
    z.object({
      description: optionalText,
      eyebrow: optionalText,
      title: textOr('Over mij'),
      intro: optionalText,
      photo: z.preprocess(empty, image().optional()),
      photo_alt: optionalText,
      highlights: optionalList(
        z.object({
          icon,
          title: z.string(),
          text: optionalText,
        }),
      ),
      work_eyebrow: optionalText,
      work_title: optionalText,
      work_text: optionalText,
      work_items: optionalList(
        z.object({
          title: z.string(),
          text: optionalText,
          image: z.preprocess(empty, image().optional()),
          image_alt: optionalText,
        }),
      ),
      next_eyebrow: optionalText,
      next_title: optionalText,
      next_text: optionalText,
      next_image: z.preprocess(empty, image().optional()),
      next_image_alt: optionalText,
      cv: optionalText,
      cta: cta(image),
    }),
});

const freelance = defineCollection({
  loader: glob({ pattern: 'freelance.md', base: './src/content/site' }),
  schema: ({ image }) =>
    z.object({
      description: optionalText,
      eyebrow: optionalText,
      title: textOr('Freelance'),
      intro: optionalText,
      hero_image: z.preprocess(empty, image().optional()),
      hero_image_alt: optionalText,
      services_eyebrow: optionalText,
      services_title: textOr('Wat ik voor je kan doen'),
      services: optionalList(
        z.object({
          title: z.string(),
          icon,
          summary: optionalText,
          description: optionalText,
          image: z.preprocess(empty, image().optional()),
          image_alt: optionalText,
          price: textOr('Prijs in overleg'),
        }),
      ),
      price_note: optionalText,
      agreements_title: optionalText,
      agreements: optionalList(z.string()),
      cta: cta(image),
    }),
});

const contact = defineCollection({
  loader: glob({ pattern: 'contact.md', base: './src/content/site' }),
  schema: ({ image }) =>
    z.object({
      description: optionalText,
      eyebrow: optionalText,
      title: textOr('Contact'),
      intro: optionalText,
      hero_image: z.preprocess(empty, image().optional()),
      hero_image_alt: optionalText,
      form_eyebrow: optionalText,
      form_title: textOr('Stuur een bericht'),
      success_message: textOr('Bedankt voor je bericht! Ik neem zo snel mogelijk contact met je op.'),
      direct_eyebrow: optionalText,
      direct_title: textOr('Direct contact'),
      socials_title: optionalText,
      socials_text: optionalText,
      privacy_text: optionalText,
      cta: cta(image),
    }),
});

const portfolio = defineCollection({
  loader: glob({ pattern: 'portfolio.md', base: './src/content/site' }),
  schema: z.object({
    eyebrow: optionalText,
    title: textOr('Mijn werk'),
    intro: optionalText,
    description: optionalText,
  }),
});

const privacy = defineCollection({
  loader: glob({ pattern: 'privacy.md', base: './src/content/site' }),
  schema: z.object({
    title: textOr('Privacyverklaring'),
    updated: z.preprocess(empty, z.coerce.date().optional()),
    intro: optionalText,
  }),
});

export const collections = { work, settings, home, about, freelance, contact, portfolio, privacy };
