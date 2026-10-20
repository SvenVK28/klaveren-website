# Contact form

The site is static (GitHub Pages), so it can't send e-mail itself. The form posts to
**[Web3Forms](https://web3forms.com)**, which e-mails every submission to one address.

## Why Web3Forms

| | Web3Forms (chosen) | Formspree | Own Cloudflare Worker + mail API |
| --- | --- | --- | --- |
| Free | 250 messages/month | 50 messages/month | yes, but two extra accounts |
| Account | none: enter an e-mail address, get a key by mail | account + dashboard | Cloudflare + mail provider |
| Key in the page | fine: the key is public by design (it only says where to deliver) | form id is public too | secret stays in the worker |
| Stores messages | no (forwards them) | yes, 30 days | no |

Web3Forms only accepts requests from browsers; server-side calls get `403 "Use our API in
client side"` (seen 2026-10-20). Its JSON reply is `{ "success": true|false, "message": "…" }`.

## How it works on the site

- `src/components/ContactForm.astro` renders the form; the key comes from the CMS field
  **Site-instellingen → Sleutel van het contactformulier** (`form_key` in `settings.yaml`).
- **No key → the form is visibly disabled** with the notice "Het contactformulier is nog niet actief"
  (and the e-mail address, if one is set). It never pretends to send.
- With JavaScript: `fetch` with JSON. The success message only appears when Web3Forms answers
  `success: true`; anything else shows an error with the e-mail address as fallback.
- Without JavaScript: a normal form POST; Web3Forms redirects to `/contact/bedankt/`.
- Spam: the `botcheck` honeypot field (Web3Forms rejects submissions that fill it).
- The e-mail's reply-to is the visitor's address, so "Reply" in the mail app answers them.
- `?opdracht=<service title>` on the contact URL pre-selects "Type opdracht" (the Freelance page links this way).

## Switching it on

1. Decide where messages should go (later `info@scvkmedia.nl`; until the domain exists any inbox works).
2. Go to <https://web3forms.com>, enter that address, and click *Create Access Key*. The key arrives by e-mail.
3. In the CMS: **Site-instellingen → Sleutel van het contactformulier**, paste the key, save.
4. After the deploy (~1–2 min), send a test message from the live site and check it arrives (also check spam).

To change the destination address later, create a new key for the new address and replace it in the CMS.

## Privacy

The privacy statement (`src/content/site/privacy.md`) names Web3Forms. Update it if the form
provider changes.
