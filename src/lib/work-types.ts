// Portfolio categories (docs/design/04-Portfolio-Content.md). The keys must
// match the `type` options in public/admin/config.yml.
export const WORK_TYPES = {
  artikel: { label: 'Artikel', plural: 'Artikelen', video: false },
  interview: { label: 'Interview', plural: 'Interviews', video: false },
  nieuwsvideo: { label: 'Nieuwsvideo', plural: "Nieuwsvideo's", video: true },
  videoreportage: { label: 'Videoreportage', plural: 'Videoreportages', video: true },
  videomontage: { label: 'Videomontage', plural: 'Videomontages', video: true },
  overig: { label: 'Overig', plural: 'Overig', video: false },
} as const;

export type WorkType = keyof typeof WORK_TYPES;

export const WORK_TYPE_KEYS = Object.keys(WORK_TYPES) as [WorkType, ...WorkType[]];

// Earlier versions of the site used other categories; map them so old entries keep building.
export const LEGACY_WORK_TYPES: Record<string, WorkType> = {
  video: 'videoreportage',
  audio: 'overig',
  fotografie: 'overig',
};

/** What kind of project it was (optional; spec §9: distinguish when it adds context). */
export const PROJECT_TYPES = {
  studieopdracht: 'Studieopdracht',
  'eigen-project': 'Eigen project',
  opdracht: 'Opdracht voor een klant',
} as const;

export type ProjectType = keyof typeof PROJECT_TYPES;

export const PROJECT_TYPE_KEYS = Object.keys(PROJECT_TYPES) as [ProjectType, ...ProjectType[]];
