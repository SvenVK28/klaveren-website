# SCVK Media — Website Design & Build Specification

> **Purpose:** This document is the source of truth for designing and building the SCVK Media website. It is intended to be handed to a separate design or development session. Follow it as a coherent brief; do not invent a different brand direction.
>
> **Brand:** SCVK Media  
> **Owner:** Sven van Klaveren  
> **Website type:** Personal journalism portfolio and freelance-services website  
> **Primary language:** Dutch  
> **Primary goal:** Present the owner's journalism work professionally and make it easy for potential clients, editors, and collaborators to understand his skills and contact him.

---

## 1. Project overview

SCVK Media is the personal portfolio and freelance brand of Sven van Klaveren, a journalism student with prior training as editorial assistant. The website should bring together the work he has made, written, filmed, edited, and produced, while also making it clear that he is available for suitable freelance assignments.

The site should work as:

1. **A portfolio** — visitors can quickly see examples of articles, interviews, news videos, and other media work.
2. **A professional introduction** — visitors can learn who Sven is, what he does, and what his working approach is.
3. **A services page** — prospective clients can understand what they can commission.
4. **A contact route** — prospective clients can contact Sven without friction.

The site should not look like a generic agency template, a personal lifestyle blog, or a student assignment page. It should feel like a compact, contemporary journalism brand: editorial, clear, confident, calm, and credible.

### Main conversion goal

Encourage a visitor who has seen the work or services to make contact about a freelance assignment.

### Secondary goals

- Demonstrate journalistic range and practical skills.
- Build trust through real examples and clear descriptions.
- Make it easy to share the website as a professional portfolio link.
- Leave room to add new work and services over time.

---

## 2. Brand identity and creative direction

### Core attributes

The design should communicate:

- **Journalistic:** editorial structure, clear hierarchy, strong headlines, media-led presentation.
- **Professional:** careful alignment, consistent spacing, polished typography, restrained colour use.
- **Modern:** contemporary layout, subtle interaction, generous whitespace.
- **Approachable:** direct language, simple navigation, human introduction.
- **Versatile:** supports written work, video, interviews, and editing without feeling scattered.
- **Confident but understated:** visual quality should come from composition and typography, not decorative effects.

### Overall look and feel

Think of a modern independent journalist's portfolio: somewhere between a digital editorial publication and a small creative studio. Use an editorial grid, strong headlines, well-composed project cards, and purposeful photography or video stills.

The website should be **clean, structured, compact, and easy to scan**. Keep the layout visually calm. Give content room to breathe, but do not make the page so sparse that it feels unfinished.

### Avoid

- Overly colourful gradients or neon colours.
- Excessive rounded cards, pill-shaped buttons everywhere, or “startup SaaS” styling.
- Decorative blobs, floating shapes, excessive shadows, and ornamental animations.
- Handwritten or overly playful fonts.
- A feminine, wedding-photography, fashion-blog, or lifestyle-influencer aesthetic.
- Dense paragraphs that make the website feel like a CV or school report.
- Invented testimonials, client logos, awards, metrics, or claims.
- Stock imagery that implies a project or client that does not exist.
- Fake project thumbnails or fabricated journalism work presented as real.

---

## 3. Logo and brand assets

### Current logo direction

The logo is based on the letters **SCVK**, with **“media”** beneath or alongside the main letters. The preferred treatment is black lettering on a white background, with a compact, geometric, rounded, contemporary feel. The letterforms should be bold enough to remain legible at small sizes.

A distinctive detail in the logo concept is a microphone element integrated into the **K**. The concept has also explored using a pen-like detail extending from the tail of the **S**. If the final supplied logo includes these elements, preserve their intended shape and connection to the letters; do not reinterpret them as unrelated icons.

### Logo rules

- Use the final approved logo asset if one is supplied.
- Do not redraw or approximate the logo in code if the actual logo file is available.
- Do not stretch, skew, crop, or add effects to the logo.
- Preserve adequate clear space around it.
- Use the black-on-white version by default.
- If a dark-blue version is required for a specific context, create or use an approved version rather than applying an arbitrary filter.
- For the mobile header, use a compact logo variant only if it remains readable.

### Logo placeholder during build

If no logo asset is available yet, use a restrained text placeholder reading **SCVK** with **media** beneath it. Do not create an elaborate temporary logo that will be difficult to replace.

---

## 4. Colour system

The design should primarily use white, near-black, and deep marine navy. Petrol blue may be used sparingly as a secondary accent if it improves the system, but it must not compete with the navy.

### Suggested design tokens

These are starting values; adjust slightly if needed for contrast and the final logo, but keep the palette restrained.

| Token | Suggested value | Use |
|---|---|---|
| `--color-background` | `#FFFFFF` | Main page background |
| `--color-surface` | `#F5F7F8` | Subtle alternate section or card background |
| `--color-text` | `#171A1D` | Main body text |
| `--color-heading` | `#101820` | Headlines and key labels |
| `--color-muted` | `#626B73` | Supporting text and metadata |
| `--color-border` | `#DDE2E6` | Dividers, card outlines, input borders |
| `--color-primary` | `#12334A` | Marine navy; links, key buttons, selected states |
| `--color-primary-hover` | `#0C2739` | Hover/focus state for navy controls |
| `--color-accent` | `#176B73` | Optional restrained petrol accent |
| `--color-on-primary` | `#FFFFFF` | Text on navy backgrounds |

### Colour usage rules

- White is the dominant background.
- Dark text should be used for nearly all headings and body copy.
- Navy should provide the main brand accent and primary CTA colour.
- Petrol should be used only in small amounts, such as a thin rule, selected label, or subtle detail.
- Use light grey for separators and quiet surfaces, not as a substitute for contrast.
- Do not use colour alone to convey status.
- Maintain accessible text contrast; do not use pale grey for important text.
- Buttons should not all use different colours.

---

## 5. Typography

Typography is one of the main design tools. The site should feel editorial rather than corporate or playful.

### Font direction

Use a modern, highly legible sans-serif family. Good options include:

- **Inter** — practical, clean, contemporary.
- **Manrope** — slightly more distinctive while remaining professional.
- **Source Sans 3** — readable and editorial.
- A strong system sans-serif stack if external fonts are not desired.

Use one family with a small, consistent weight range, or pair a restrained display face for headlines with a highly readable sans-serif for body text. Avoid using many font families.

### Suggested hierarchy

| Element | Desktop guidance | Mobile guidance | Notes |
|---|---|---|---|
| Hero headline | `clamp(2.7rem, 5vw, 4.8rem)` | `clamp(2.2rem, 9vw, 3.2rem)` | Strong, short, tightly spaced |
| Page title | `clamp(2.2rem, 4vw, 3.5rem)` | `clamp(2rem, 8vw, 2.7rem)` | Clear entry point |
| Section title | `clamp(1.5rem, 2.5vw, 2.2rem)` | `1.5–1.8rem` | Consistent hierarchy |
| Card title | `1.15–1.4rem` | `1.1–1.25rem` | 2–3 lines max where possible |
| Body | `1rem–1.125rem` | `1rem` | Comfortable line-height |
| Metadata | `0.8–0.9rem` | `0.8–0.9rem` | Labels, date, category |
| Navigation | `0.9–1rem` | `0.95rem` | Clear, not oversized |

### Typography rules

- Use a comfortable body line-height of about `1.55–1.75`.
- Use tighter line-height for large headings, around `1.0–1.15`.
- Keep long text blocks to a readable measure, ideally around 60–75 characters per line.
- Use bold weight for hierarchy, not for entire paragraphs.
- Avoid all-caps body copy. Uppercase can be used sparingly for short category labels.
- Website copy should sound natural, direct, and confident in Dutch.

---

## 6. Layout, grid, and spacing

### Page width

- Use a centred content container with a maximum width of approximately `1200–1280px`.
- Use a comfortable desktop gutter of `40–64px`, reducing responsively.
- On mobile, use `20–24px` side padding.
- Long-form article text should use a narrower reading column than the main page grid.

### Grid

- Use a 12-column or similarly flexible editorial grid on desktop.
- Portfolio work can use a 3-column grid on wide screens, 2 columns on tablets, and 1 column on small phones.
- Use consistent gaps, generally `24–32px` between portfolio cards.
- Do not force every section into cards; some sections should be open, full-width editorial layouts.

### Spacing rhythm

Use a consistent spacing scale, such as multiples of 4 or 8px:

`4px`, `8px`, `12px`, `16px`, `24px`, `32px`, `48px`, `64px`, `80px`, `96px`.

Typical section spacing:

- Desktop: `72–104px` vertical padding.
- Tablet: `56–80px`.
- Mobile: `44–64px`.

Use whitespace to establish hierarchy. Do not add spacing randomly between similar elements.

### Borders and shadows

- Prefer thin, light borders and clean edges.
- Use little or no shadow.
- Slightly rounded corners are acceptable for media cards and form fields; keep radii modest, around `4–10px`.
- Avoid oversized, bubbly rounded rectangles.

---

## 7. Navigation and site structure

### Main navigation

The primary navigation should be simple and visible on every page.

Recommended labels, in Dutch:

1. **Mijn werk**
2. **Over mij**
3. **Freelance**
4. **Contact**

The logo at the left should link to the homepage. On desktop, navigation can sit to the right in a single horizontal header. On mobile, use a clear menu button and an accessible menu panel.

### Header behaviour

- Use a white background.
- A thin bottom border is acceptable.
- Keep the header compact; it should not dominate the first screen.
- A sticky header is optional, but only if it does not take too much vertical space on mobile.
- Use visible hover, focus, and active states.
- Keep the navigation labels exactly consistent throughout the site.
- Avoid adding more top-level pages unless they are genuinely needed.

### Suggested routes

- `/` — Home
- `/mijn-werk` — Portfolio overview
- `/mijn-werk/[slug]` — Individual project detail, if appropriate
- `/over-mij` — About
- `/freelance` — Services
- `/contact` — Contact

The final URL format can change to suit the implementation, but the structure should remain clear.

---

## 8. Homepage requirements

The homepage should answer three questions quickly:

1. Who is this?
2. What can this person make or do?
3. How can I view the work or get in touch?

### Section 1: Hero

**Purpose:** Introduce the brand and route visitors to work or services.

Recommended content direction (copy may be refined, but do not overstate experience):

- Brand/name: **SCVK Media**
- Short headline example: **Journalistiek, van verhaal tot video.**
- Supporting text example: **Ik schrijf artikelen, neem interviews af en maak en monteer video’s. Bekijk mijn werk of neem contact op voor een freelanceopdracht.**
- Primary CTA: **Bekijk mijn werk**
- Secondary CTA: **Bespreek een opdracht** or **Freelance mogelijkheden**

Do not use a vague headline such as “Stories that matter” without explaining the actual services.

### Hero visual

Use one strong, relevant visual rather than a collage of unrelated stock photos. Options:

- A genuine image of Sven working, if supplied and approved.
- A strong still from a real video project.
- A carefully selected, neutral editorial image that does not falsely imply it is a real assignment.

Never use AI-generated or stock imagery as if it were a documentary photograph of an actual interview or news event. If the image is illustrative, it should read as atmosphere rather than evidence.

### Section 2: Selected work

- Display a curated selection of approximately 3–6 projects.
- Each card should show a thumbnail, work type, title, and a short explanatory sentence.
- Use real project details supplied by the owner.
- Make each item clickable and keyboard accessible.
- Link to the full work or a detail page where possible.
- If a project is not yet published, mark it appropriately or omit it; do not imply it is public when it is not.

Potential categories (only use where real work exists):
- Artikel
- Interview
- Nieuwsvideo
- Videoreportage
- Videomontage

### Section 3: Services preview

Show a concise summary of the core services, then link to the Freelance page. Use simple text-led items rather than decorative icons for every service.

Possible services:
- Artikelen schrijven
- Interviews afnemen
- Interviews uitwerken tot een artikel
- Video monteren in Adobe Premiere Pro
- Voice-over en videoreportage

Only include a service if the owner is comfortable delivering it. Describe experience honestly.

### Section 4: Short about introduction

A compact introduction that states Sven is a journalism student and describes his focus and approach. Avoid a long biography on the homepage.

CTA: **Meer over mij**

### Section 5: Contact CTA

Finish with a clear invitation, such as:

**Een idee of opdracht?**  
**Neem contact op om de mogelijkheden te bespreken.**  
Button: **Neem contact op**

### Footer

Include:
- SCVK Media logo or wordmark.
- Compact navigation.
- Contact email once confirmed.
- LinkedIn link once supplied.
- SCVK Media Instagram link once supplied.
- Copyright line with current year generated by the site or updated manually.
- Privacyverklaring link if a privacy page is published.

Do not invent URLs, handles, email addresses, phone numbers, or social accounts.

---

## 9. Portfolio page: “Mijn werk”

### Purpose

Make the owner's work easy to browse and let visitors quickly understand the range and quality of projects.

### Layout

- Clear page title: **Mijn werk**
- Short introduction: one or two sentences explaining that this page brings together articles, interviews, videos, and other productions.
- A project grid with consistent cards.
- Optional filters only if there are enough projects to make filtering useful.

### Project card content

Each card should contain:

1. A thumbnail or still.
2. A visible category label.
3. A concise project title.
4. A short summary, ideally one or two lines.
5. Optional date or publication name, if relevant and accurate.
6. A clear affordance to open or view the project.

### Filtering

If the portfolio contains enough examples, use simple filters such as:
- Alles
- Artikelen
- Interviews
- Video
- Montage

If there are fewer than about 6–8 items, a filter may add complexity without much value; use a straightforward grid instead.

### Project detail page (recommended when needed)

Each project detail page may include:
- Project title.
- Type/category and date, if known.
- Short context or assignment.
- Sven’s specific role (e.g. interviewer, writer, editor, camera, voice-over).
- Embedded video or published article link.
- A small “Meer werk” section to return to the portfolio.

Do not claim the project was commissioned by a named client or published by a named outlet unless that is true. Distinguish between student assignments, personal projects, and paid client work when it adds useful context.

### Media handling

- Use compressed images and responsive video embeds.
- Set appropriate aspect ratios and avoid layout shifts while media loads.
- Provide descriptive alt text for meaningful images.
- Videos should have controls and captions/subtitles where available.
- Do not autoplay audio. Avoid autoplay video, especially on mobile.

---

## 10. About page: “Over mij”

### Purpose

Present Sven as a real, approachable, developing journalism professional without overselling experience.

### Content direction

Include:
- Name: **Sven van Klaveren**
- Current status: journalism student at the Hogeschool van Amsterdam (verify current wording before publication).
- Prior education: editorial assistant training programme (include if the owner wants this on the public site).
- Areas of interest and practical skills.
- A short explanation of how he approaches stories and assignments.
- A simple route to contact him.

### Writing style

- Dutch.
- First person is appropriate.
- Clear, concrete language.
- Short paragraphs.
- Avoid corporate clichés such as “passionate storyteller,” “disruptive,” “360-degree solutions,” or “bringing stories to life” unless the owner explicitly prefers them.
- Do not present the owner as an experienced professional journalist if he is still studying.
- Emphasise initiative, curiosity, reliability, and a willingness to discuss a brief, if those qualities accurately reflect the owner.

### Skills section

A concise section called **Vaardigheden en expertise** may list relevant skills, such as:
- Artikelen schrijven
- Interviews voorbereiden en afnemen
- Interviews uitwerken tot artikelen
- Video monteren in Adobe Premiere Pro
- Voice-over
- Videoreportage

Only list skills the owner can genuinely provide. Avoid skill ratings, percentages, and invented proficiency levels.

---

## 11. Freelance page: “Freelance”

### Purpose

Explain what clients can hire Sven for, what they can expect, and how to enquire.

### Tone

Professional, direct, approachable. The page should not read like a high-pressure sales page. Avoid making unsupported promises about turnaround times, audience reach, or guaranteed results.

### Recommended service structure

Use a clean list or a grid of service blocks. Each service should have:
- Service title.
- One short explanation of what is included.
- Optional examples or deliverables.
- Price note: **Prijs in overleg**.
- CTA: **Neem contact op**.

Do not invent fixed prices. The owner has indicated that prices should be discussed case by case.

### Service 1: Artikelen schrijven

Suggested description:
“Ik schrijf artikelen op basis van aangeleverde informatie, research en/of gesprekken. We bespreken vooraf het onderwerp, de insteek, de gewenste lengte en de deadline.”

Do not promise research or fact-checking beyond what is agreed in the assignment.

### Service 2: Interviews afnemen

Suggested description:
“Ik bereid interviews voor en neem gesprekken af om informatie, ervaringen of standpunten helder in beeld te brengen. De insteek, duur en vorm stemmen we vooraf af.”

The owner has considered short interviews of up to around 2 minutes and longer interviews of 30 minutes or more as different formats. These durations may be described as examples, not guaranteed packages, unless confirmed.

### Service 3: Interviews uitwerken tot een artikel

Suggested description:
“Ik werk een interview uit tot een helder artikel waarin de belangrijkste uitspraken en inzichten centraal staan. Vooraf bespreken we het doel, de doelgroep en de gewenste lengte.”

Do not imply that the interviewee automatically receives editorial approval or a right to rewrite the piece. If relevant, agree on quote-checking and publication arrangements beforehand.

### Service 4: Video monteren

Suggested description:
“Ik monteer aangeleverd beeldmateriaal in Adobe Premiere Pro tot een samenhangende video. Denk aan het selecteren en ordenen van beelden, het monteren van interviews, het toevoegen van voice-over en het verwerken van ondertiteling wanneer dit is afgesproken.”

Do not promise colour grading, advanced motion graphics, sound design, or other specialist services unless the owner confirms these capabilities.

### Service 5: Voice-over en videoreportage

Suggested description:
“Ik kan meedenken over de opbouw van een korte videoreportage, voice-overtekst maken of inspreken, en beeld en interviews samenbrengen tot een duidelijk verhaal.”

Clarify which parts of production are included in each assignment. Do not imply access to camera equipment or a production crew unless confirmed.

### Pricing and scope

Every service may show:
- **Prijs in overleg**
- A short line such as “De prijs hangt af van de omvang, voorbereiding en gewenste oplevering.”
- **Neem contact op** CTA

Before starting an assignment, make scope and expectations clear:
- What will be delivered.
- Whether research/interviewing/filming/editing are included.
- Deadline and revision rounds.
- Fee and payment terms.
- Publication and usage rights.
- Whether travel or other expenses are charged.

### General freelance CTA

Suggested copy:

**Een opdracht bespreken?**  
“Vertel kort wat je nodig hebt. Dan bespreken we samen of en hoe ik kan helpen.”  
Button: **Neem contact op**

---

## 12. Contact page: “Contact”

### Purpose

Make it easy to start a conversation. Keep this page straightforward and low-friction.

### Content

- Clear title: **Contact**
- Short invitation: “Heb je een vraag of wil je een freelanceopdracht bespreken? Stuur gerust een bericht.”
- Contact email once created and verified.
- LinkedIn link, when supplied.
- SCVK Media Instagram link, when supplied.
- A simple contact form if supported by the chosen platform.

### Suggested form fields

Required:
- Naam
- E-mailadres
- Bericht

Optional:
- Organisatie
- Onderwerp

Use clear field labels, visible required-field indicators, inline validation, and a helpful success/error state. Never display a success message unless the submission actually succeeded.

### Privacy

If a form collects personal data:
- Publish a privacy statement describing the purpose and handling of the data.
- Collect only information that is needed.
- Do not add a marketing newsletter checkbox unless the site genuinely offers a newsletter.
- Do not collect sensitive personal information.
- Configure spam prevention without making the form unnecessarily difficult to use.
- Ensure the form has a real destination and works; do not build a visual-only form that silently discards messages.

If a working form cannot be connected during the first build, use a clear email link as a fallback and explicitly identify the form as not yet active rather than pretending it works.

---

## 13. Footer and global components

### Footer

Keep the footer minimal and useful:
- Logo/wordmark.
- Links to Mijn werk, Over mij, Freelance, Contact.
- Email address once confirmed.
- LinkedIn and Instagram only after URLs are supplied.
- Privacy statement, if present.
- Copyright line.

### Buttons

Use a consistent system:
- Primary button: navy background, white text.
- Secondary button: white or transparent background, navy text and a thin navy border.
- Text links: navy or near-black with clear hover and focus states.

Button labels should describe the action, for example:
- Bekijk mijn werk
- Meer over mij
- Bespreek een opdracht
- Neem contact op

Avoid generic labels such as “Klik hier”.

### Links and states

- All links should be visibly identifiable.
- Hover effects should be subtle and not the only indication of interactivity.
- Keyboard focus must be visible.
- Active navigation state should be clear.

---

## 14. Photography, thumbnails, and video

### Visual direction

Use editorial visuals that support the content. Prioritise:
1. Real work and authentic project stills supplied by the owner.
2. Approved personal photos.
3. Neutral illustrative imagery, clearly not presented as actual reporting evidence.

Images should feel documentary/editorial, natural, and restrained. Avoid oversaturated colours, staged corporate handshakes, generic people pointing at laptops, and unrelated lifestyle imagery.

### Consistency

- Use a consistent crop and aspect ratio across similar project cards.
- Keep the focal subject visible at common breakpoints.
- Add a restrained navy or neutral treatment only if it does not obscure the image.
- Use alt text that describes meaningful visual information, not keyword stuffing.
- Decorative images should have empty alt text in the implementation.

### Empty portfolio state

If there are not enough approved projects yet:
- Do not invent work.
- Use a small number of genuine items.
- It is acceptable to state that the portfolio is being expanded, but phrase this confidently and unobtrusively.
- Do not create fake client logos or fabricated case studies just to fill space.

---

## 15. Responsive design

The website must be designed mobile-first and work cleanly on small screens.

### Desktop

- Full horizontal navigation.
- Editorial grid with 2–3 project cards per row depending on width.
- Strong hero headline and one dominant visual.
- Keep body copy readable and line lengths controlled.

### Tablet

- Reduce horizontal spacing.
- Use 2-column project grids where appropriate.
- Avoid shrinking typography excessively.

### Mobile

- Compact header and accessible menu.
- One-column portfolio grid.
- Buttons should be easy to tap, with a target size around 44px or more.
- Stack hero content and visuals naturally.
- Avoid horizontal scrolling.
- Avoid text overlaid on busy images if readability suffers.
- Keep forms usable with mobile keyboards.
- Use responsive images and appropriately sized media.
- Do not allow fixed/sticky elements to cover page content.

### Responsive acceptance tests

Test at minimum:
- Small phone width around 320–375px.
- Typical phone width around 390–430px.
- Tablet around 768px.
- Laptop around 1280–1440px.
- Wide desktop around 1600px.

---

## 16. Accessibility and usability

Aim for WCAG 2.2 AA practices where practical.

- Semantic HTML: use real headings, navigation, main, sections, and footer.
- One clear H1 per page, followed by logical heading levels.
- Full keyboard navigation.
- Visible focus indicators.
- Sufficient colour contrast.
- Descriptive link text.
- Meaningful alt text for informative images.
- Captions/subtitles for videos when available.
- Form labels connected to their inputs.
- Clear errors and confirmation states.
- Respect reduced-motion preferences.
- Do not communicate important information through colour alone.
- Ensure the menu and modal/dialog elements (if any) work with keyboards and assistive technologies.

Animation should be optional, subtle, and never required to understand the page.

---

## 17. Interaction and motion

Keep motion restrained and purposeful.

Appropriate:
- A short opacity/translate transition on hover.
- A subtle underline or colour transition on links.
- Gentle reveal transitions if they do not delay access to content.
- Clear focus states.

Avoid:
- Long intro animations.
- Scroll hijacking.
- Parallax that interferes with reading.
- Auto-advancing carousels.
- Flashing or bouncing effects.
- Animations that hide content until a script runs.

All essential content should remain visible and usable if animation is disabled or JavaScript fails.

---

## 18. Technical and implementation requirements

The design should be implementable with the selected site builder or framework. If the build environment is not yet chosen, prefer a maintainable, accessible implementation over unnecessary complexity.

### General

- Use reusable components for header, footer, buttons, portfolio cards, service blocks, and form fields.
- Keep design tokens in one place (CSS variables or theme configuration).
- Use semantic, maintainable markup.
- Avoid unnecessary dependencies.
- Keep the page lightweight and performant.
- Use stable image dimensions or aspect ratios to reduce layout shift.
- Compress and serve images in appropriate modern formats where supported.
- Lazy-load below-the-fold images where appropriate.
- Do not lazy-load the primary hero image if it is essential to initial rendering.
- Ensure external links behave consistently and securely.
- Add descriptive page titles and meta descriptions in Dutch.
- Add a favicon using the approved brand asset if available.

### SEO basics

- Unique title and meta description per page.
- One clear H1 per page.
- Human-readable URLs.
- Descriptive alt text.
- Open Graph metadata for sharing, using real brand assets and accurate page titles.
- A sitemap and robots configuration where appropriate to the platform.
- Do not add fake structured data, fake ratings, or unearned review markup.

### Performance

- Aim for fast initial load, especially on mobile.
- Avoid large background videos and oversized images.
- Prevent layout shifts by setting media dimensions.
- Limit third-party scripts.
- Load only the font weights actually used.
- Test performance using available auditing tools before launch.

### Security and reliability

- Use HTTPS.
- Do not expose secret keys or private form credentials in client-side code.
- Validate contact form input on the server or trusted form service where applicable.
- Use spam protection proportionately.
- Make sure all buttons and links do what their labels promise.
- Test 404 pages and broken links.

---

## 19. Privacy, legal information, and professional accuracy

This is a Dutch personal portfolio and freelance website. The implementation should support the owner's legal obligations without pretending to provide legal advice.

- If personal data is collected via forms, analytics, embedded media, or other tools, assess the applicable privacy and cookie requirements.
- Publish a privacy statement when appropriate.
- Use cookie consent only where legally required; do not add a misleading banner that suggests all cookies require the same treatment.
- Identify the website owner and provide appropriate contact information.
- Do not publish a home address or personal phone number unless the owner intentionally chooses to make it public and understands the implications.
- If operating as a business, verify which business details must be shown on the website.
- Do not fabricate a KvK number, VAT number, company address, client names, endorsements, or awards.
- If the owner is not yet registered with the KvK, do not present a made-up registration number or imply that a registration has already happened.
- Do not use copyrighted photos, music, fonts, articles, or video without permission or an appropriate licence.
- Ensure the owner has the right to publish work samples and interview material.
- Do not promise that the website automatically makes the owner compliant with all legal requirements; review the final setup before launch.

---

## 20. Dutch-language website copy and voice

The website should use natural Dutch. Prefer short, specific sentences and concrete verbs.

### Voice characteristics

- Professioneel
- Duidelijk
- Direct
- Benaderbaar
- Niet overdreven formeel
- Niet opschepperig

### Copy principles

- Say what the owner does, not just that he is creative or passionate.
- Keep paragraphs short.
- Use active language.
- Explain specialist terms when needed.
- Avoid exaggerated claims.
- Avoid invented results, client outcomes, or experience.
- Use “ik” on the About page and service descriptions where it sounds natural.
- Keep calls to action consistent.

### Suggested core message

**SCVK Media — journalistiek, van verhaal tot video.**

Suggested supporting line:
“Ik schrijf artikelen, neem interviews af en maak en monteer video’s. Bekijk mijn werk of neem contact op om een freelanceopdracht te bespreken.”

Treat this as a starting point rather than immutable copy; refine it only if the core message remains clear and accurate.

---

## 21. Content that must be confirmed before launch

Do not guess these details. Use temporary placeholders only during development, and make them obvious to the site owner.

- Final approved logo file and any variants.
- Final email address (for example, `info@scvkmedia.nl` only once created and verified).
- Whether the domain `scvkmedia.nl` has been purchased and configured.
- Actual LinkedIn profile URL.
- Actual SCVK Media Instagram URL.
- Final biography and preferred public details.
- Approved portfolio items, titles, descriptions, dates, and links.
- Which work is a student assignment, personal project, or paid client assignment.
- Which services the owner wants to offer publicly.
- Whether the contact form will be connected and where submissions will go.
- Privacy statement and any analytics/cookie tools.
- Business details that are legally required, if applicable.
- Whether the owner wants to publish a phone number or business address.

Never ship a production site with broken placeholder links, invented content, or an unconnected contact form.

---

## 22. Recommended content model

For ease of updating, each portfolio project should be represented as structured content with fields such as:

- `title`
- `slug`
- `category`
- `shortDescription`
- `thumbnail`
- `publicationOrContext` (optional, factual only)
- `date` (optional)
- `role`
- `externalUrl` (optional)
- `videoEmbedUrl` (optional)
- `featured` (boolean)
- `status` (e.g. published, student project, personal project; use only if helpful)

The implementation may use a CMS, static data, or another suitable approach. Do not introduce a complex CMS unless the owner needs it.

---

## 23. Suggested design tokens

Use these as a practical starting point for implementation:

```css
:root {
  --color-background: #FFFFFF;
  --color-surface: #F5F7F8;
  --color-text: #171A1D;
  --color-heading: #101820;
  --color-muted: #626B73;
  --color-border: #DDE2E6;
  --color-primary: #12334A;
  --color-primary-hover: #0C2739;
  --color-accent: #176B73;
  --color-on-primary: #FFFFFF;

  --font-sans: "Inter", "Manrope", "Source Sans 3", system-ui, sans-serif;

  --content-width: 1280px;
  --reading-width: 720px;

  --radius-small: 4px;
  --radius-medium: 8px;

  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-6: 24px;
  --space-8: 32px;
  --space-12: 48px;
  --space-16: 64px;
  --space-20: 80px;
  --space-24: 96px;
}
```

These tokens should be centralised so the visual system remains consistent and can be tuned without editing every component.

---

## 24. Build order

Recommended order of implementation:

1. Confirm logo, domain/email status, social links, and the first set of portfolio items.
2. Establish colour, typography, spacing, grid, buttons, and responsive tokens.
3. Build the shared header and footer.
4. Build the homepage hero and selected-work section.
5. Build the portfolio overview and project detail template.
6. Build the About page.
7. Build the Freelance services page.
8. Build the Contact page and connect the form or email link.
9. Add privacy/legal pages and metadata appropriate to the actual setup.
10. Test responsive layouts, keyboard access, links, forms, and media.
11. Run accessibility and performance checks.
12. Review all public claims and content with the owner.
13. Launch only after all placeholders are replaced and all contact routes work.

---

## 25. Definition of done / acceptance checklist

The website is ready when:

### Brand and design
- [ ] It clearly looks like SCVK Media, not a generic template.
- [ ] The logo is the approved version and is not distorted.
- [ ] White, near-black, and marine navy dominate the palette.
- [ ] Typography, spacing, buttons, and cards are consistent.
- [ ] The design feels editorial, modern, professional, and approachable.

### Content and navigation
- [ ] The primary navigation uses Mijn werk, Over mij, Freelance, Contact.
- [ ] The homepage explains the brand and provides a clear route to work and contact.
- [ ] Portfolio items are real, accurate, and properly linked.
- [ ] The About page describes the owner accurately without overstating experience.
- [ ] Every listed service is something the owner is willing and able to deliver.
- [ ] Service pricing is described as “Prijs in overleg” unless the owner approves fixed prices.
- [ ] No fake testimonials, clients, awards, or metrics appear.
- [ ] The contact route is clear on every page.

### Functionality
- [ ] Navigation works on desktop and mobile.
- [ ] All buttons and links work.
- [ ] The contact form genuinely submits, or a working email fallback is provided.
- [ ] Validation and success/error messages are clear and accurate.
- [ ] Media embeds work and do not autoplay audio.
- [ ] No placeholder links or missing images remain.

### Accessibility and performance
- [ ] Pages work with keyboard navigation.
- [ ] Focus states are visible.
- [ ] Text contrast is sufficient.
- [ ] Images have appropriate alt text.
- [ ] Video captions/subtitles are used where available.
- [ ] Layout is usable from small phones to wide desktops.
- [ ] Images are optimised and layout shifts are minimised.
- [ ] Page titles and meta descriptions are present.

### Launch readiness
- [ ] Domain and HTTPS are configured.
- [ ] Contact email is verified.
- [ ] Social links are correct.
- [ ] Privacy/cookie handling reflects the actual tools used.
- [ ] Any legally required business details are accurate.
- [ ] All public-facing copy has been reviewed by the owner.

---

## 26. Final instruction to the design/build session

Use this document as the central design brief. Prioritise a **clean, editorial, structured, professional and understated** experience. The website should make SCVK Media feel credible while accurately representing a journalism student building a portfolio and offering freelance services.

Do not invent content, credentials, projects, prices, client relationships, contact details, or legal registration information. Where a fact or asset is missing, use a clearly labelled development placeholder and ask for confirmation before launch.

The finished result should be visually polished, easy to navigate, mobile-friendly, accessible, fast, and straightforward for the owner to maintain.
