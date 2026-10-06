// The kinds of work on the site. The keys must match the `type` options in
// public/admin/config.yml.
export const WORK_TYPES = {
  artikel: { label: 'Artikel', plural: 'Artikelen' },
  video: { label: 'Video', plural: 'Video' },
  audio: { label: 'Audio', plural: 'Audio' },
  fotografie: { label: 'Fotografie', plural: 'Fotografie' },
  overig: { label: 'Overig', plural: 'Overig' },
} as const;

export type WorkType = keyof typeof WORK_TYPES;

export const WORK_TYPE_KEYS = Object.keys(WORK_TYPES) as [WorkType, ...WorkType[]];
