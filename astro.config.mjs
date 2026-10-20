// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Where the site lives. While it runs on GitHub Pages the site sits in a
// sub-folder (/klaveren-website/). Once a custom domain (scvkmedia.nl) is connected:
//   1. set SITE to 'https://scvkmedia.nl'
//   2. set BASE to '/'
//   3. put the domain in public/CNAME
//   4. update site_url, display_url and logo.src in public/admin/config.yml
const SITE = 'https://svenvk28.github.io';
const BASE = '/klaveren-website';

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  // The thank-you page after the contact form isn't a page to find through search.
  integrations: [sitemap({ filter: (page) => !page.includes('/contact/bedankt/') })],
  // Addresses of the first version of the site.
  redirects: {
    '/werk/': `${BASE}/mijn-werk/`,
    '/over/': `${BASE}/over-mij/`,
  },
  image: {
    layout: 'constrained',
    responsiveStyles: true,
  },
  fonts: [
    {
      provider: fontProviders.fontsource(),
      name: 'Inter',
      cssVariable: '--font-inter',
      weights: ['400 700'],
      styles: ['normal'],
      subsets: ['latin', 'latin-ext'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
  ],
});
