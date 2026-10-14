---
title: "Hello, world"
description: "Why I'm running my own minimal site, with a newsletter built in, instead of a platform."
date: 2026-09-29
tags: [meta, newsletter]
newsletter: true
draft: true
featured: true
---

This is a sample post. Replace it with your first real one, or delete it.

## Why own the stack

Owning the site means the URLs, the subscriber list, and the content are mine. Search engines and AI answer engines index **my** domain, not a platform's.

## How it works

- Posts are Markdown files in `content/posts/`.
- Setting `newsletter: true` makes a post sendable with `pnpm send <slug>`.
- Setting `emailOnly: true` sends it to subscribers but never publishes it on the site.

```ts
const post = getPublicPost("hello-world");
```

> Links like [the about page](/about) are turned into absolute URLs in the email, RSS and Markdown versions automatically.
