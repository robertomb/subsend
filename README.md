# Subsend

Your own newsletter and archive, on your own domain. Posts are Markdown in git, the site is static Next.js, and subscribers and sending run on [Resend](https://resend.com) (Contacts, Segments, Broadcasts). No database, no platform.

- **Landing page and archive:** a newsletter-first home page, an archive by year, tags, an About page and a colophon.
- **Email:** double opt-in, React Email templates, one-command broadcasts, and optional email-only issues.
- **Discoverable:** structured data, OG images, sitemap, full-text RSS, `llms.txt`, and a Markdown copy of every post for AI assistants.
- **Light:** static HTML, system fonts, light and dark mode.

## Making it yours

Everything personal lives in a few places:

| Where | What |
| --- | --- |
| `site.config.ts` | Name, domain, bio, social links, newsletter copy, sender addresses, incoming-mail choices |
| `content/posts/` | Your posts (see "Writing") |
| `content/about.md`, `content/colophon.md` | Your About page and "how this is built" page |
| `public/avatar.jpg` | Your photo, also used for the favicon and share images |

Then follow "Setup".

## Writing

Create `content/posts/<slug>.md`. The filename is the URL: `/posts/<slug>`. Don't rename published posts.

```yaml
---
title: "Post title"
description: "One or two sentences. Subtitle, meta description, RSS and llms.txt summary."
date: 2026-10-01
updated: 2026-10-15    # optional
tags: [product]
newsletter: true       # can be sent with `pnpm send`
emailOnly: false       # true = sent by email, never published on the site
draft: false           # drafts show in `pnpm dev` only
featured: false        # true = listed under "Start here" on the landing page (pick ~3)
canonical: "https://…" # optional, if originally published elsewhere
---
```

Email-only issues and drafts live in your repo, so **keep your site's repo private** if you use them.

## Sending an issue

```bash
pnpm send <slug> --test       # proof it in your own inbox
git push                      # deploy the post (public posts must be live first)
pnpm send <slug>              # broadcast to subscribers, then commit the sentAt it writes
pnpm indexnow /posts/<slug>   # tell search engines it's new
```

`pnpm email:dev` previews the email templates in `src/emails/`.

## Setup

1. `pnpm install`, then `cp .env.example .env.local` and fill it in.
2. **Resend:** set up headlessly with the CLI, MCP and agent skills. Follow [docs/resend.md](docs/resend.md).
3. **Hosting** (Vercel works out of the box): add the env vars from `.env.example` (`NEWSLETTER_TEST_TO` and `CLOUDFLARE_API_TOKEN` stay local), deploy, and attach your domain. `.vercelignore` keeps `.env*` from being uploaded by `vercel deploy`.
4. Register the site in Google Search Console and Bing Webmaster Tools, and submit `https://<your-domain>/sitemap.xml`.

## Incoming email: pick one, both, or neither

Choose in `site.config.ts` → `inbound`:

| Option | What it is |
| --- | --- |
| **Resend Inboxes** (`inbound.inboxes`) | A full inbox in Resend: threads, replies, labels. No code involved. |
| **Webhook forwarding** (`inbound.forwarding`) | `/api/inbound` forwards each received email to a personal address. |

Setup for both is in [docs/resend.md](docs/resend.md#incoming-mail). With forwarding off or its env vars missing, `/api/inbound` returns 404.

## Keeping your site up to date

Start your site from this repo (GitHub's **Use this template**, or clone it), then add this repo as `upstream`:

```bash
git remote add upstream https://github.com/robertomb/subsend.git
git pull upstream main --allow-unrelated-histories   # first time only
git pull upstream main                                # later updates
```

Because your changes live in `site.config.ts`, `content/` and `public/avatar.jpg`, updates rarely touch the same files.

## What's where (SEO / AI discoverability)

| URL | Purpose |
| --- | --- |
| `/posts/<slug>` | Static HTML, `BlogPosting` + `BreadcrumbList` JSON-LD, canonical, OG image |
| `/posts/<slug>.md` | Clean Markdown copy for LLMs (canonical header points to the HTML) |
| `/llms.txt`, `/llms-full.txt` | Index / full text for LLMs ([llmstxt.org](https://llmstxt.org)) |
| `/rss.xml` | Full-content RSS |
| `/sitemap.xml`, `/robots.txt` | All crawlers allowed, including AI crawlers |
| `/tags/<tag>` | `noindex` until a tag has 3+ posts |

## License

[MIT](LICENSE)
