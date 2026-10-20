# Portfolio website: plan

A portfolio for a journalism student: articles, video, audio and photo work in one
place. He can post something new every 2–3 weeks through an admin page, without
touching code. Hosting should be free.

## Decisions

| Topic | Choice | Why |
| --- | --- | --- |
| Site generator | **Astro 7** (static output) | Built for content sites. Markdown content collections with schema validation, built-in image optimisation, zero JS by default. |
| Admin / CMS | **Sveltia CMS** at `/admin` | Free, git-based (no database or server). Dutch UI, works on a phone (installable PWA), drag-and-drop uploads that convert photos to WebP. Successor to Decap/Netlify CMS. |
| Hosting | **GitHub Pages**, deployed by GitHub Actions | Free, HTTPS, custom domain support. Each CMS save is a commit, and each commit rebuilds the site (live in about 1–2 min). |
| Source code | Repo on `SvenVK28` (**public** since 2026-10-20) | Public code is acceptable. In a public repo, though, drafts and unpublished uploads are readable by anyone. Pages from a private repo needs **GitHub Pro** (free with the Student Developer Pack); a public repo works on a free account. |
| Admin privacy | **Must be private**: only the two editors | Today: only GitHub collaborators can sign in and save, but the login page itself is reachable. Planned: Cloudflare Access (email code) in front of `/admin`, once the custom domain is on Cloudflare DNS. |
| Video / audio | Embed from YouTube / Vimeo / Spotify / SoundCloud | Git can't hold large media (100 MB/file, 1 GB/site). Embeds stream better and cost nothing. |
| Styling | Plain CSS with design tokens (`src/styles/global.css`) | The design is a placeholder. Every colour, font and spacing value lives in one block so a redesign is cheap. |

### Why it counts as "dynamic" without a server

To the editor it behaves like a dynamic site: log in, write, press *Publiceren*,
and it's live a minute later. Under the hood the CMS commits Markdown and photos to
the repo, and Actions rebuilds the static site. A static site is faster, can't be
hacked through a login form or plugins, and costs nothing to host.

### Alternatives considered

- **WordPress / Ghost**: truly dynamic, but needs paid hosting (about €5–10/month) and updates.
- **Decap CMS**: same model as Sveltia, but older UI, slower, and needs an OAuth server too.
- **TinaCMS / Keystatic**: nicer visual editing, but need Tina Cloud or a server runtime. GitHub Pages can't run one.
- **Pages CMS** (app.pagescms.org): good UI, and editors can be invited by email without a GitHub
  account. It's a hosted third party with access to the repo, and not an `/admin` on his own site.
  It's a fallback if a GitHub account turns out to be a hurdle for him. It reads the same Markdown files.

## Content model

**Mijn werk** (`src/content/work/<slug>/index.md`): one folder per project, with its photos next to it.
Fields follow the brief (`docs/design/04-Portfolio-Content.md`).

| Field | Notes |
| --- | --- |
| `title`, `type` | type = `artikel` / `interview` / `nieuwsvideo` / `videoreportage` / `videomontage` / `overig` |
| `summary` | Shown on cards and as the meta description |
| `cover`, `cover_alt`, `cover_credit` | Required in the CMS (every item has at least one photo); optimised by Astro |
| `role` | "Mijn rol": what he did himself |
| `date`, `show_date` | Date orders the list (newest first); `show_date: false` hides it when it isn't known |
| `project_type` | Optional: studieopdracht / eigen project / opdracht voor een klant |
| `media_url` | YouTube/Vimeo/Spotify/SoundCloud link → click-to-play player |
| `publication`, `external_url` | "Gepubliceerd bij …" plus a link to the original (only if true) |
| `context`, `credits` | Assignment context; collaborators |
| `featured`, `draft` | Featured items come first on the homepage. Drafts are never built. |
| `gallery[]`, `attachments[]` | Extra photos with captions. PDFs. |
| body | Rich text with inline images |

**Pages** (`src/content/site/<page>.md`, frontmatter only): `home`, `portfolio`, `about`,
`freelance` (with the `services` list), `contact`, `privacy` (+ body). **Settings**
(`settings.yaml`): site name, owner, description, e-mail, socials, Web3Forms key, preview switch,
the CTA under projects.

## Pages

`/` home · `/mijn-werk/` all work · `/mijn-werk/soort/<categorie>/` filtered ·
`/mijn-werk/<slug>/` project · `/over-mij/` · `/freelance/` · `/contact/` (+ `/contact/bedankt/`) ·
`/privacy/` · `/rss.xml` · `/sitemap-index.xml` · `/admin/` CMS · 404. Old `/werk/` and `/over/` redirect.

## SCVK Media redesign (2026-10-20)

The owner sent his brief (`docs/design/`). The plan for this round:

1. Rebrand: his navy logo (his own doc calls it the standard), the brief's colour/type/spacing
   tokens, Inter, layouts after the five mock-ups.
2. All pages above, all text and photos editable in the CMS, services as an editable list.
3. Contact form via Web3Forms; visibly "nog niet actief" until a key is set, never a fake success.
4. Privacy: no cookies of our own except Google Analytics after consent (cookie banner, added
   2026-10-20); video players load only after a click;
   a draft privacy statement that names Web3Forms and GitHub Pages.
5. Placeholders that can't be mistaken for real work: CC0 stock photos as atmosphere, a silhouette
   instead of a portrait, `Voorbeeld:` projects, a "Voorbeeldversie" banner + `noindex`.
6. Draft copy from the brief's own suggestions (not the AI mock-up text); he rewrites it.

Still needed from the owner: his own copy, photos, portrait and projects (with rights), the
domain, an e-mail address (→ Web3Forms key), LinkedIn and Instagram URLs, OK on the favicon,
and which services he really wants to offer.

## Logging in to the CMS

Every editor needs a (free) GitHub account with write access to the repo.

1. **Now:** "Sign in with token". Nothing extra to host. The owner can use a fine-grained token
   (Contents: read & write, this repo only). A collaborator needs a *classic* token with `repo`
   scope, because GitHub doesn't allow fine-grained tokens for collaborators on another user's repo.
2. **For the friend, recommended:** "Sign in with GitHub" (OAuth) through the free
   [sveltia-cms-auth](https://github.com/sveltia/sveltia-cms-auth) Cloudflare Worker. This needs
   a Cloudflare account and a GitHub OAuth app. See the README.

## Costs

| Item | Cost |
| --- | --- |
| GitHub Pages + Actions | €0 (a private repo needs Pro, which is free for students; a public repo works on a free account) |
| Sveltia CMS, Cloudflare Worker, Cloudflare Access (≤ 50 users) | €0 |
| Contact form (Web3Forms, up to 250 messages/month) | €0 |
| Custom domain, e.g. `.nl` (optional) | Often ~€1–5 the first year, then ~€10–15/year |

## Roadmap

1. ✅ Research and plan
2. ✅ Astro skeleton, content model, temporary design
3. ✅ Sveltia CMS at `/admin`
4. ✅ Repo (private on `Sven-vh` at first, public on `SvenVK28` since 2026-10-20), Actions deploy, Pages live at `https://svenvk28.github.io/klaveren-website/`
5. ✅ End-to-end CMS test (create, publish, verify the live site, delete), README and a Dutch guide for the editor
6. **Required:** make the admin page unreachable for others (Cloudflare Access in front of `/admin`).
7. ✅ SCVK Media design after his brief (2026-10-20)
8. **Next:** his real content and copy, domain `scvkmedia.nl` (`public/CNAME`, `site` in the config,
   drop `base`), e-mail + contact form key, launch checklist (`docs/design/07-…`).
9. **Later:** OAuth login, and possibly moving the repo to his account
