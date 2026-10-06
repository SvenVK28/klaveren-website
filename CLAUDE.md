# CLAUDE.md: project memory for future sessions

Read this first. It records **what** we're building, **why** it's built this way, what's
**done**, and the **gotchas** that already cost time. Shareable docs: `docs/PLAN.md` (decisions
and costs), `README.md` (developer how-to), `docs/HANDLEIDING.md` (Dutch guide for the editor).

---

## 1. What we're making, and for whom

A **portfolio website for Sven van Klaveren**, a journalism student.

- **The user** (who works with Claude) is also called **Sven** (GitHub `Sven-vh`). He's a
  developer, builds the site as a favour, and maintains it. He writes in English and Dutch.
- **The editor/owner of the site** is his friend **Sven van Klaveren**: non-technical, Dutch.
  ⚠️ Because both are named Sven, never write "ask Sven" in editor-facing text. Use
  "degene die de site voor je gebouwd heeft".

### The friend's goals (his own words, summarised)
1. Publish his **articles and journalistic productions** (also **video**, and likely audio and
   photo) in one clear, structured place, instead of only in his school OneDrive.
2. **Credibility when approaching people**, e.g. for interviews. He puts the link under an
   email: "hij doet dit vaker en het wordt geen matige productie".
3. Show his work to **teachers** and, later, to **places he wants to intern**.
4. Post something new **every 2–3 weeks**, at any moment, so it must be "dynamic".
5. Will pay a little if needed (e.g. a domain), but **not much**.

### The user's requirements
- Dynamic: the friend can post any time, through an **admin page with a good UI**.
- Host on **GitHub Pages** (free, reliable).
- **The admin page must be private: only the two Svens can get in.** This is a hard
  requirement, and the user cares about it more than about the code (stated 2026-10-06). See §2a.
- **Public code is fine** (the user changed this 2026-10-06; it was "code private" at first). The repo is
  still private today. Making it public is allowed, but **drafts and unpublished uploads in the
  repo would then be public too** (§2a). Raise that before making the repo public.
- Use the **`Sven-vh` account for now**. It's temporary and will likely move to another account
  (README has the checklist).
- No content or design examples yet, so the **design is a temporary placeholder** that must be
  easy to change. Focus first on backend, hosting and the CMS. The friend was asked to collect
  links, photos and explanations of sites he likes in a Google Doc.

---

## 2. Current status (last updated 2026-10-06)

**Live:** https://sven-vh.github.io/klaveren-website/ · **Admin:** `/admin/` ·
**Repo:** `Sven-vh/klaveren-website` (PRIVATE)

Done and verified:
- Astro 7 site: home, `/werk/` with type filters, detail pages, `/over/`, 404, RSS, sitemap. Dark
  mode, mobile layout, no horizontal overflow (screenshots checked).
- Sveltia CMS at `/admin/`, Dutch UI, config validated against the official schema.
- GitHub Actions deploy to Pages. Pages from a private repo **works**, so the account has Pro.
- **End-to-end on the live site**: sign in with token → create entry with a 3000×2000 JPEG →
  commit (`Nieuw: productie "…"`, photo stored as a 2400px WebP next to `index.md`) → build →
  page live → delete through the CMS (entry and its media removed). The user also edited an
  entry through the admin themselves, and that deployed fine.
- Site name is **Sven van Klaveren**. Five `voorbeeld-*` example entries are placeholders.

Not done yet / waiting on someone:
- [ ] The friend creates a GitHub account → add him as a collaborator → he makes a **classic**
      token (see gotchas) → walk him through `docs/HANDLEIDING.md`.
- [ ] Optional: "Inloggen met GitHub" via the sveltia-cms-auth Cloudflare Worker. Needs the
      user's Cloudflare account and a GitHub OAuth app (README has the steps). Until then
      `auth_methods: [token]` hides the GitHub button, which would otherwise fail.
- [ ] Real design, once the friend shares examples.
- [ ] His real content, then delete the `voorbeeld-*` entries (he can do it in the CMS).
- [ ] Maybe: custom domain (mijndomein.nl was mentioned), move the repo to another account.
- [ ] Sveltia 0.230.0 is out (pinned 0.229.0). Update when convenient (README > Updating).
- [ ] **Make the admin page itself unreachable for others** (§2a). This is a requirement, not optional.

## 2a. Admin privacy: requirement, current state, plan

**Requirement:** nobody except the user and the friend can access or use the admin.

**Current state (honest):**
- *Editing is locked:* signing in requires a GitHub account with **write access to the repo**.
  Only collaborators can save anything. Others can't read the content through the CMS
  either, because the repo is private.
- *The page itself is reachable:* anyone who knows `/admin/` sees the Sveltia login screen, and
  `/admin/config.yml` (field definitions and the repo name) is publicly downloadable. Search
  engines are kept away (`noindex` and a `robots.txt` `Disallow`, which only takes effect at a
  domain root, so only once the custom domain is live), and nothing on the site links to the admin.
  That's obscurity, not access control.

**Plan, recommended: Cloudflare Access in front of `/admin*`** (free, up to 50 users). Visitors must
enter an allow-listed email and type in a one-time code mailed to them before the admin page even loads.
It needs the custom domain with DNS on Cloudflare (proxied, SSL "Full"). The domain can stay
registered at MijnDomein; only the nameservers change. It pairs well with the
sveltia-cms-auth worker, which also runs on Cloudflare. Alternatives: host only the admin
separately (e.g. Cloudflare Pages + Access) and remove `public/admin` from the public site; or a
secret path, which is weak and not recommended on its own.

**Rules until then and after:** never add a link to the admin on the public site, keep
`noindex`, never enable Open Authoring, and keep sign-in restricted to collaborators. Every change
to auth or hosting must be checked against this requirement.

**If the repo becomes public:** pages from a public repo work on a free GitHub account, so Pro is no longer
needed. But everything committed is world-readable, including entries with `draft: true` and media
uploaded for unpublished pieces. That can matter for journalism (sources, embargoes, work in
progress). Tell the friend that "Concept" doesn't mean private then, or keep the repo private (needs Pro).

---

## 3. Architecture and the reasoning behind it

```
editor ─► /admin (Sveltia CMS, runs in the browser) ─► GitHub API commit to main
       ─► GitHub Actions (withastro/action) ─► GitHub Pages (static files)
```

| Decision | Why | Rejected alternatives |
| --- | --- | --- |
| **Static site + git-based CMS** | Feels dynamic to the editor (save → live in ~1–2 min), with no server or DB to pay for, patch or get hacked. Fits "free" and "GitHub Pages". | WordPress/Ghost: paid hosting and maintenance. |
| **Astro 7** | Content collections with schema validation, built-in image optimisation, zero JS by default, easy to redesign. Good for a content portfolio. | Hugo/Eleventy: fine too, but Astro suits a TS/React developer and the image pipeline. |
| **Sveltia CMS** | Free, modern UI, **Dutch locale**, mobile and PWA, WebP conversion on upload, and the admin lives on *his own site* at `/admin`. Decap-compatible config. | Decap (older and slower, same OAuth need). TinaCMS/Keystatic (need Tina Cloud or a server runtime). **Pages CMS** (app.pagescms.org) is the fallback if a GitHub account is too much for the friend: it supports email invites and reads the same Markdown. |
| **Entry folders** `src/content/work/<slug>/index.md` with photos next to them | Lets Astro's `image()` optimise every photo (responsive WebP). Deleting an entry in the CMS removes its media. Avoids base-path problems with `/public` image URLs. | Global `public/uploads`: no optimisation, and base-path issues. |
| **Video/audio as embeds** (YouTube, Vimeo, Spotify, SoundCloud) | Git limits: 100 MB per file, about 1 GB per Pages site. Embeds stream better. | Uploading video into the repo. |
| **Plain CSS + tokens** in `src/styles/global.css` | The design is temporary, so all colours, fonts and sizes live in one place. | Tailwind (fine, but unnecessary for a throw-away design). |
| **Lenient Zod schemas** | If the build fails, the friend's edit silently doesn't appear. GitHub emails the *actor* (the friend). So the CMS validates input, and the site schema tolerates `''`/`null` and missing optionals. | Strict schemas. |
| **Token login first** | Zero extra infrastructure. GitHub has no PKCE for SPAs, so "Sign in with GitHub" needs an OAuth proxy (Cloudflare Worker). | Netlify OAuth (deprecated path). |
| **Admin access = GitHub write access** (for now), Cloudflare Access planned | Only collaborators can save. Hiding the page itself needs a gate in front of it, because GitHub Pages has no access control on a personal account (private Pages need Enterprise Cloud). See §2a. | Password in JavaScript (fake security), secret URL only. |
| **Stock photo libraries disabled** in the CMS | It's a journalism portfolio; everything should be his own work. | |
| **CMS preview pane disabled** | The generic preview only repeated the fields. The live site is the real preview ("Bekijken op de live site" link via `preview_path`). | Custom preview templates (possible later). |

Content model: see `src/content.config.ts` (source of truth for the site) and
`public/admin/config.yml` (source of truth for the editor UI). Work types:
`artikel | video | audio | fotografie | overig` (`src/lib/work-types.ts`).

---

## 4. Rules and conventions

- **Language:** everything the editor or visitors see (site UI, CMS labels and hints, editor docs)
  is **Dutch**. Code, comments, commit messages by us, and dev docs are **English**. CMS commit
  messages are Dutch (configured in `config.yml`).
- **Keep `public/admin/config.yml` and `src/content.config.ts` in sync.** New CMS fields should be
  `required: false` unless every entry has them. Run `npm run check:cms` after editing the config.
- **Internal links always go through `url()`** from `src/lib/url.ts`. The site lives under the base
  path `/klaveren-website/`. Never hardcode `/werk/...`. `url()` passes external URLs through
  and prefixes `/files/...` CMS paths.
- **Images:** the CMS writes **bare filenames** (`cover: photo.webp`, not `./photo.webp`). Astro 7's
  `image()` and Markdown accept this (verified). PDFs and the CV go to `public/files/` →
  `/files/x.pdf` → render with `url()`.
- `trailingSlash: 'always'`, so links end in `/`.
- Commits we make end with the `Co-Authored-By` line from the system reminder. Commit or push
  only when the user asks or it's part of the agreed task.
- **Admin privacy is a hard requirement** (§2a): don't link to `/admin` from the site, don't weaken
  sign-in, and check any change to auth or hosting against it.
- Don't publish the friend's personal data beyond what he enters himself. The e-mail field hint
  warns that it's public.

---

## 5. Gotchas already learned (don't rediscover these)

**Astro 7 (newer than most training data):**
- Zod 4, imported from `astro/zod` (not `astro:content`). Config lives at `src/content.config.ts`,
  and every collection needs a `loader` (`glob()`).
- `glob({ pattern: '*/index.md' })` gives entry ids **without** `/index` (e.g. `voorbeeld-…`).
- Default Markdown processor is **Sätteri**, not remark/rehype. remark/rehype plugins need
  `markdown.processor: unified()` from `@astrojs/markdown-remark`. We use none on purpose.
- `compressHTML: 'jsx'` by default: whitespace between inline elements collapses. Use flex `gap`
  or `{" "}` for spacing.
- The Rust compiler rejects unclosed or invalid HTML.
- `@astrojs/check` needs TypeScript ≤ 6. TS 7 exists, so it's pinned to `^6`.
- Fonts via the stable Fonts API (`fonts:` in `astro.config.mjs`, `<Font />` in the layout),
  downloaded from Fontsource at build time.

**Sveltia CMS (pinned 0.229.0 in `public/admin/index.html` and `scripts/check-cms-config.mjs`):**
- No PKCE for GitHub yet, so OAuth needs `base_url` pointing at an auth worker.
- **Fine-grained PATs don't work for collaborators on a repo owned by another personal
  account.** The friend needs a **classic** token with `repo` scope. The owner can use
  fine-grained (Contents: read & write).
- `slug_length` is deprecated; use the global `slug.maxlength`.
- The slug is editable only at creation (`editable: [create]`), so shared links never break.
- Admin entry URLs look like `#/collections/work/entries/<slug>/index`.
- In the UI, **"Bladeren"** opens the media dialog and **"Uploaden"** inside it opens the file
  picker. The delete confirmation is a dialog titled "Item verwijderen".
- The `test-repo` backend (in memory) is great for UI tests. It warns that `backend.repo`,
  `branch`, `auth_methods` and `commit_messages` are unknown, which is expected.
- Sveltia shows a GitHub-status banner ("GitHub heeft een kleine storing") during GitHub incidents.
  That's not our bug.

**GitHub:**
- Pages source = GitHub Actions (enabled via `gh api -X POST repos/…/pages -f build_type=workflow`).
- An annotation says the `ubuntu-latest` runner moves to **Ubuntu 26 from 2026-10-19**. Watch the
  first build after that date.
- Failed-run emails go to whoever triggered the run, which is the friend for CMS saves.

**This Windows machine (Git Bash + PowerShell):**
- Bash heredocs containing complex template code broke on quote parsing. **Write `.astro` and other
  template files with the Write tool**, not `cat <<EOF`.
- `npx astro preview` serves `dist/`, so **rebuild after changing anything in `public/`**.
- Playwright is installed **globally**: run scripts with `NODE_PATH="$APPDATA/npm/node_modules"`.
  Chromium is in `%LOCALAPPDATA%\ms-playwright`.
- `gh` is logged in as `Sven-vh` (device flow; scopes `repo`, `workflow`). The local git identity is
  `Sven <54216207+Sven-vh@users.noreply.github.com>` (repo-local config, there's no global
  `.gitconfig`). To log in again in the background: `gh auth login --web --scopes workflow`
  writes a one-time code to its output. Give the user the code and URL, then poll `gh auth status`.
  The code expires in about 15 min.
- YouTube `hqdefault.jpg` is 4:3 with letterbox bars. Cards use `hq720.jpg` with an `onerror`
  fallback to `hqdefault` (see `src/lib/embed.ts`).

---

## 6. How to verify changes

```sh
npm run check        # types + Astro diagnostics (expect 0 errors)
npm run build        # also validates all content against the schemas
npm run check:cms    # CMS config vs. official JSON schema
```

Visual and CMS checks (start `npx astro preview` first; Playwright via NODE_PATH, see above):

| Script | What it does |
| --- | --- |
| `scripts/dev/screenshots.cjs [base] [paths]` | Desktop, mobile and dark full-page screenshots → `screenshots/`. Flags overflow and errors. |
| `scripts/dev/cms-smoke.cjs [adminUrl]` | Admin with the in-memory test backend: collection and new-entry screenshots, reports config warnings. |
| `scripts/dev/cms-e2e.cjs create\|delete [adminUrl]` | **Real** CMS against GitHub (makes commits!). `CMS_TOKEN="$(gh auth token)"`. Run `create`, inspect the commit and live page, then `delete`. |

After pushing: `gh run watch <id> --exit-status`, then `curl` the live URL. Look at screenshots
with the Read tool. Don't call design work done without looking.

---

## 7. Likely next tasks and how to approach them

- **Real design:** start from the friend's examples. Most changes belong in the tokens in
  `global.css`, plus the components in `src/components/`. Keep it fast, accessible and mobile-first.
- **New content type or field:** config.yml + content.config.ts + render it, then
  `check:cms`, build, and the smoke test.
- **OAuth login:** README > "Inloggen met GitHub". The user has to do the Cloudflare and OAuth-app
  parts in the browser. Then set `base_url` and remove `auth_methods`.
- **Custom domain or account move:** README has step-by-step checklists. Only `astro.config.mjs`
  and `public/admin/config.yml` matter functionally.
