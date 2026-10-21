// Categories (artikel, interview, …) are content now: src/content/categories/, edited in the
// CMS under "Categorieën" (getCategories in ./content.ts).

/** What kind of project it was (optional; spec §9: distinguish when it adds context). */
export const PROJECT_TYPES = {
  studieopdracht: 'Studieopdracht',
  'eigen-project': 'Eigen project',
  opdracht: 'Opdracht voor een klant',
} as const;

export type ProjectType = keyof typeof PROJECT_TYPES;

export const PROJECT_TYPE_KEYS = Object.keys(PROJECT_TYPES) as [ProjectType, ...ProjectType[]];
