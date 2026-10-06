import type { APIRoute } from 'astro';
import { url } from '../lib/url';

export const GET: APIRoute = ({ site }) =>
  new Response(
    ['User-agent: *', `Disallow: ${url('admin/')}`, `Sitemap: ${new URL(url('sitemap-index.xml'), site)}`, ''].join('\n'),
  );
