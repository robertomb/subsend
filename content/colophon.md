This page is about how this site is made: why it's my own site instead of a blogging or newsletter platform, and what it's built with.

## Why it's built this way

The domain, the posts and the subscriber list belong to me, not to a platform. A few rules shaped it:

- **Light and fast.** Pages are plain HTML and load almost instantly.
- **Easy to keep running.** No database and no admin panel. Posts are text files.
- **Easy to find.** Every post has a permanent, public page that search engines and AI assistants can read and link to.
- **Readable everywhere.** In the browser, in RSS readers, and in any email client.

## How it works

1. Each post is a Markdown file committed to Git.
2. The site rebuilds into static pages: one per post, plus the archive, the RSS feed and a few files for search engines.
3. When a post should also go out by email, a test goes to me first, then it goes to every subscriber with a single command.

## What it's built with

It runs on [Subsend](https://github.com/robertomb/subsend), an open-source starter for a minimal personal website with a newsletter built in.

**Email: [Resend](https://resend.com).** Broadcasts send posts by email, Contacts and Segments hold the subscriber list, React Email renders the templates, and subscribing uses double opt-in with a confirmation link that expires after 48 hours.

**Site: [Next.js](https://nextjs.org).** Every page is generated in advance, fonts come from your device, and light and dark mode follow your system setting.

**Discoverability.** Structured data on every page, [`/llms.txt`](/llms.txt) and a Markdown version of every post for AI assistants, a sitemap, and a full-text [RSS feed](/rss.xml).

## Want one like it?

It's open source: [grab the code](https://github.com/robertomb/subsend) and make it yours.
