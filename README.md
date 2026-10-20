# SCVK Media website (klaveren-website)

Portfolio and freelance site of **SCVK Media**, the journalism brand of Sven van Klaveren:
articles, interviews and video work, freelance services and a contact form.
It's a static [Astro](https://astro.build) site with [Sveltia CMS](https://sveltiacms.app) at
`/admin/` for editing, published to GitHub Pages by GitHub Actions. The owner's design brief and
mock-ups are in [docs/design/](docs/design/README.md).

- **Site:** https://svenvk28.github.io/klaveren-website/
- **Admin:** https://svenvk28.github.io/klaveren-website/admin/
- **Plan and decisions:** [docs/PLAN.md](docs/PLAN.md)
- **Guide for the editor (Dutch):** [docs/HANDLEIDING.md](docs/HANDLEIDING.md)
- **Contact form (Web3Forms):** [docs/CONTACT-FORM.md](docs/CONTACT-FORM.md)
- **Context, gotchas and status for Claude Code sessions:** [CLAUDE.md](CLAUDE.md)

## How it works

```
editor ──► /admin (Sveltia CMS) ──► commit to main ──► GitHub Actions build ──► GitHub Pages
```

Each save in the CMS is a commit with Markdown and photos. The `Deploy site` workflow rebuilds
the site, and it's live about 1–2 minutes later. There's no server or database.

## Local development

```sh
npm install
npm run dev        # http://localhost:4321/klaveren-website/
npm run build      # production build into dist/
npm run check      # TypeScript + Astro diagnostics
npm run check:cms  # validate public/admin/config.yml against the Sveltia schema
```

To use the CMS locally, open http://localhost:4321/klaveren-website/admin/index.html in
Chrome or Edge, choose **Werken met een lokale repository**, and pick this folder. Edits are
written straight to your working copy, and you commit them yourself.

Drafts (`draft: true`) show up in `npm run dev` with a "Concept" label but are never built.

Browser checks (screenshots, CMS smoke and end-to-end tests) live in `scripts/dev/`. See CLAUDE.md §6.

## Project layout

| Path | What |
| --- | --- |
| `src/content/work/<slug>/index.md` | One project per folder. Its photos sit next to it. |
| `src/content/site/` | One file per page (`home.md`, `portfolio.md`, `about.md`, `freelance.md`, `contact.md`, `privacy.md`; frontmatter = the page's fields) + `settings.yaml`. Page photos in `images/`. |
| `src/assets/brand/` | Logo (made from `docs/design/logo/` by `scripts/brand/prepare-logo.mjs`) |
| `src/content.config.ts` | Content schemas (Zod) |
| `public/admin/config.yml` | CMS fields. **Keep in sync with `content.config.ts`.** |
| `public/files/` | Downloads uploaded through the CMS (PDFs, CV) |
| `src/styles/global.css` | Design tokens (colours, fonts, spacing, from the brief) and base styles |
| `src/lib/embed.ts` | Turns YouTube/Vimeo/Spotify/SoundCloud links into click-to-play players |
| `src/lib/work-types.ts`, `src/lib/icons.ts` | Categories and the icons the editor can pick (must match `config.yml`) |
| `src/components/ContactForm.astro` | The contact form (Web3Forms) |
| `.github/workflows/deploy.yml` | Build and deploy to Pages |

**Adding a field:** add it to `public/admin/config.yml` (`required: false` unless every entry
has it), add it to the schema in `src/content.config.ts`, and render it. Keep schemas lenient. A
failing build means the editor's changes silently don't appear. GitHub emails the person who
triggered the run (the editor, for CMS saves) when it fails.

**Example content:** everything starting with `voorbeeld-` in `src/content/work/` is placeholder
content, as are the stock photos (CC0, see `docs/design/photo-credits.json`) and the portrait
silhouette. `preview: true` in `settings.yaml` adds a "Voorbeeldversie" banner and `noindex`.

**Logo:** never redraw it. If the owner sends a new file, put it in `docs/design/logo/` and run
`node scripts/brand/prepare-logo.mjs` (transparent logo, favicon, share image).

## Giving the editor access

1. He creates a free GitHub account.
2. Add him as a collaborator: *Settings → Collaborators → Add people*, or
   `gh api -X PUT repos/SvenVK28/klaveren-website/collaborators/<username> -f permission=push`.
3. He signs in at `/admin/`:
   - **Today: access token.** GitHub doesn't allow *fine-grained* tokens for collaborators on
     another user's repo, so he needs a **classic** token with the `repo` scope:
     https://github.com/settings/tokens/new?scopes=repo&description=Portfolio%20CMS.
     The steps are in the [handleiding](docs/HANDLEIDING.md). For yourself, a fine-grained token
     with *Contents: read and write* on this repo is enough.
   - **Better: "Sign in with GitHub"** (see below). No tokens to manage.

## Admin privacy (requirement)

Only the two editors may access the admin. Today, only GitHub collaborators can sign in and save,
but the `/admin/` login screen itself is publicly reachable. The plan is Cloudflare Access (email
code, free) in front of `/admin*` once the custom domain runs on Cloudflare DNS. Details and
rules are in [CLAUDE.md §2a](CLAUDE.md).

## Inloggen met GitHub (OAuth, optional, free)

GitHub's OAuth needs a small server to hold the client secret. Use the official
[Sveltia CMS Authenticator](https://github.com/sveltia/sveltia-cms-auth) on Cloudflare Workers
(free tier):

1. Deploy the worker: use the *Deploy to Cloudflare* button in its README, or clone it and run
   `npx wrangler deploy`. Note the URL, e.g. `https://sveltia-cms-auth.<you>.workers.dev`.
2. Create a GitHub OAuth app at https://github.com/settings/applications/new:
   - Homepage URL: `https://svenvk28.github.io/klaveren-website/`
   - Authorization callback URL: `https://sveltia-cms-auth.<you>.workers.dev/callback`
3. In the worker's settings, add `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` (as a secret) and
   `ALLOWED_DOMAINS=svenvk28.github.io`.
4. In `public/admin/config.yml`, set `backend.base_url` to the worker URL and remove
   `auth_methods: [token]`.

## Custom domain (later)

Planned: `scvkmedia.nl`.

1. Buy the domain, e.g. at mijndomein.nl, and point DNS at GitHub Pages:
   [docs](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).
2. Create `public/CNAME` containing the domain.
3. In `astro.config.mjs`, set `SITE = 'https://domein.nl'` and `BASE = '/'`.
4. In `public/admin/config.yml`, update `site_url`, `display_url` and `logo.src`.
5. Set the domain under *Settings → Pages → Custom domain* and enable *Enforce HTTPS*.

## Moving the repo to another account

The repo moved from `Sven-vh` to `SvenVK28` on 2026-10-20 (made public, then transferred). To move it again:

1. Decide whether the repo stays private:
   - **Private:** the new account needs **GitHub Pro**, which Pages from a private repo requires.
     Students get it free with the [GitHub Student Developer Pack](https://education.github.com/pack).
   - **Public:** works on a free account, but drafts (`draft: true`) and unpublished uploads become
     readable by anyone on GitHub.

   Either way, the admin page must stay private (CLAUDE.md §2a).
2. *Settings → General → Transfer ownership*.
3. Replace the account name (`grep -rn "sven-vh" --exclude-dir=node_modules -i .`). Only two files
   matter for the site to work:
   - `astro.config.mjs`: `SITE` (and `BASE` if the repo is renamed)
   - `public/admin/config.yml`: `backend.repo`, `site_url`, `display_url`, `logo.src`

   The rest are links in the docs.
4. On the new repo, *Settings → Pages → Source: GitHub Actions*, then re-run the
   *Deploy site* workflow.
5. Editors sign in again. With OAuth, update the OAuth app URLs and `ALLOWED_DOMAINS`.

With a custom domain, the public URL stays the same through a move.

## Updating Sveltia CMS

The version is pinned in `public/admin/index.html` and `scripts/check-cms-config.mjs`.
Bump both, run `npm run check:cms` and `npm run dev`, and check `/admin/`.
[Releases](https://github.com/sveltia/sveltia-cms/releases).
