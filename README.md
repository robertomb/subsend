# Subsend

Your own newsletter and archive, on your own domain. Posts are Markdown in git, the site is static Next.js, and subscribers and sending run on [Resend](https://resend.com) (Contacts, Segments, Broadcasts). No database, no platform.

- **Landing page and archive:** a newsletter-first home page, an archive by year, tags, an About page and a colophon.
- **Email:** double opt-in, React Email templates, one-command broadcasts, and optional email-only issues.
- **Discoverable:** structured data, OG images, sitemap, full-text RSS, `llms.txt`, and a Markdown copy of every post for AI assistants.
- **Light:** static HTML, system fonts, light and dark mode.

## How much does it cost?

**$0 a month**, plus a domain name (about $10–15 a year), until your list passes 1,000 subscribers.

| Service | What it does here | Free tier |
| --- | --- | --- |
| [Resend](https://resend.com/pricing) | Subscribers, broadcasts, confirmation emails, inboxes | **1,000 contacts** for newsletters (marketing is priced by contacts, not by emails sent), plus **3,000 transactional emails a month, max 100 a day** (the double opt-in confirmations), 3 domains, 3 inboxes, 1 webhook. No marketing analytics |
| [Vercel](https://vercel.com/pricing) | Hosts the site | Hobby plan: 100 GB of traffic and 1M function calls a month, 50K analytics events. **Personal, non-commercial use only** |
| [Cloudflare](https://www.cloudflare.com/plans/) | DNS (optional; any DNS provider works) | Free |
| [GitHub](https://github.com/pricing) | Your code and posts, in a private repo | Free |

What that gets you for free:
- A newsletter with up to **1,000 subscribers**, on your own domain.
- **Up to 100 new subscribers a day**: each signup sends one confirmation email, which counts against the daily limit of 100.
- Mail at your own addresses through Resend Inboxes (up to 3).
- A fast, static site that easily handles hundreds of thousands of page views a month.

When you'll need to pay:
- **More than 1,000 subscribers:** Resend's marketing plan starts at $40/month for 5,000 contacts.
- **More than 100 signups a day,** say after a post goes viral: Resend Pro (transactional) is $20/month and removes the daily cap.
- **Making money from it** (paid subscriptions, sponsorships): Vercel's Hobby plan is for non-commercial use, so move to Pro at $20/month, or host somewhere else.

Free-tier limits change. Check each pricing page before you rely on them (last checked October 2026).

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
git config pull.rebase false                          # always merge updates, never rebase your site's history
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
