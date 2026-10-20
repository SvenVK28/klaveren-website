import { getCollection, type CollectionEntry } from 'astro:content';
import { parseEmbed } from './embed';
import { url } from './url';

export type Work = CollectionEntry<'work'>;

/** All published work, newest first. Drafts only show up in `npm run dev`. */
export async function getWork(): Promise<Work[]> {
  const entries = await getCollection('work', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

/** Work for the homepage: featured items first, topped up with the rest. */
export async function getHomeWork(count: number): Promise<Work[]> {
  const work = await getWork();
  const featured = work.filter((entry) => entry.data.featured);
  const rest = work.filter((entry) => !entry.data.featured);
  return [...featured, ...rest].slice(0, count);
}

export const workUrl = (entry: Work) => url(`mijn-werk/${entry.id}/`);

/** Cover photo, or failing that the video thumbnail. */
export function coverOf(entry: Work) {
  return entry.data.cover ?? parseEmbed(entry.data.media_url)?.thumbnail;
}

/** Each page singleton is one file in src/content/site/. */
function only<T>(entries: T[], name: string): T {
  if (!entries[0]) throw new Error(`Missing the file for "${name}" in src/content/site/`);
  return entries[0];
}

export const getSettings = async () => only(await getCollection('settings'), 'settings').data;
export const getHome = async () => only(await getCollection('home'), 'home');
export const getAbout = async () => only(await getCollection('about'), 'about');
export const getFreelance = async () => only(await getCollection('freelance'), 'freelance');
export const getContact = async () => only(await getCollection('contact'), 'contact');
export const getPortfolio = async () => only(await getCollection('portfolio'), 'portfolio').data;
export const getPrivacy =async () => only(await getCollection('privacy'), 'privacy');
