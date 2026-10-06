import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getSettings, getWork, workUrl } from '../lib/content';
import { WORK_TYPES } from '../lib/work-types';

export async function GET(context: APIContext) {
  const settings = await getSettings();
  const work = await getWork();
  return rss({
    title: settings.name,
    description: settings.description ?? settings.tagline ?? '',
    site: context.site!,
    trailingSlash: true,
    items: work.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: workUrl(entry),
      categories: [WORK_TYPES[entry.data.type].label, ...entry.data.tags],
    })),
    customData: '<language>nl-nl</language>',
  });
}
