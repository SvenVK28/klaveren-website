// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';

// Where the site lives: the custom domain, at the root. The domain itself is set
// under Settings → Pages on GitHub (no CNAME file: Actions deploys ignore it). If
// the site ever goes back to <user>.github.io/<repo>/, set BASE to '/<repo>' and
// update site_url, display_url and logo.src in public/admin/config.yml.
const SITE = 'https://scvkmedia.nl';
const BASE = '/';
// BASE without its trailing slash, for building paths.
const ROOT = BASE.replace(/\/$/, '');

export default defineConfig({
  site: SITE,
  base: BASE,
  trailingSlash: 'always',
  // The thank-you page after the contact form isn't a page to find through search.
  integrations: [sitemap({ filter: (page) => !page.includes('/contact/bedankt/') })],
  // Addresses of the first version of the site.
  redirects: {
    '/werk/': `${ROOT}/mijn-werk/`,
    '/over/': `${ROOT}/over-mij/`,
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
