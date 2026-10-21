import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { categoryOf, getCategories, getSettings, getWork, workUrl } from '../lib/content';

export async function GET(context: APIContext) {
  const settings = await getSettings();
  const work = await getWork();
  const categories = await getCategories();
  return rss({
    title: settings.name,
    description: settings.description ?? '',
    site: context.site!,
    trailingSlash: true,
    items: work.map((entry) => ({
      title: entry.data.title,
      description: entry.data.summary,
      pubDate: entry.data.date,
      link: workUrl(entry),
      categories: [categoryOf(categories, entry.data.type).label],
    })),
    customData: '<language>nl-nl</language>',
  });
}
