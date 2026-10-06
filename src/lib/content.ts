import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { parseEmbed } from './embed';
import { url } from './url';

export type Work = CollectionEntry<'work'>;

/** All work, newest first. Drafts only show up in `npm run dev`. */
export async function getWork(): Promise<Work[]> {
  const entries = await getCollection('work', ({ data }) => import.meta.env.DEV || !data.draft);
  return entries.sort((a, b) => b.data.date.getTime() - a.data.date.getTime());
}

export const workUrl = (entry: Work) => url(`werk/${entry.id}/`);

/** Cover photo, or failing that the video thumbnail. */
export function coverOf(entry: Work) {
  return entry.data.cover ?? parseEmbed(entry.data.media_url)?.thumbnail;
}

async function single<C extends 'settings' | 'home' | 'about'>(collection: C, id: string) {
  const entry = await getEntry(collection, id);
  if (!entry) throw new Error(`Missing src/content/site/${id} (collection "${collection}")`);
  return entry;
}

export const getSettings = async () => (await single('settings', 'settings')).data;
export const getHome = async () => (await single('home', 'home')).data;
export const getAbout = () => single('about', 'about');
