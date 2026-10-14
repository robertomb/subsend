import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const POSTS_DIR = path.join(process.cwd(), "content/posts");

const frontmatterSchema = z.object({
  title: z.string().min(1),
  // Required: used as subtitle, meta description, RSS summary and llms.txt summary.
  description: z.string().min(1).max(200),
  date: z.coerce.date(),
  updated: z.coerce.date().optional(),
  tags: z.array(z.string()).default([]),
  newsletter: z.boolean().default(false),
  // Email-only issues are never rendered, listed, or indexed on the site.
  emailOnly: z.boolean().default(false),
  draft: z.boolean().default(false),
  // Shown in "Start here" on the landing page. Pick your best 3.
  featured: z.boolean().default(false),
  canonical: z.url().optional(),
  // Written by `pnpm send` after a live broadcast. Guards against double sends.
  sentAt: z.coerce.date().optional(),
});

type Frontmatter = z.infer<typeof frontmatterSchema>;

export type Post = Frontmatter & {
  slug: string;
  filePath: string;
  content: string; // raw markdown body
  readingMinutes: number;
};

const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readPost(file: string): Post {
  const filePath = path.join(POSTS_DIR, file);
  const slug = file.replace(/\.md$/, "");
  if (!SLUG_RE.test(slug)) {
    throw new Error(`Invalid slug "${slug}": use lowercase-kebab-case filenames.`);
  }
  const { data, content } = matter(fs.readFileSync(filePath, "utf8"));
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) {
    throw new Error(`Invalid frontmatter in ${file}:\n${z.prettifyError(parsed.error)}`);
  }
  const words = content.trim().split(/\s+/).length;
  return {
    ...parsed.data,
    slug,
    filePath,
    content,
    readingMinutes: Math.max(1, Math.round(words / 230)),
  };
}

let cache: Post[] | undefined;

/** Every post on disk, newest first, including drafts and email-only issues. */
function getAllPosts(): Post[] {
  if (cache && process.env.NODE_ENV === "production") return cache;
  cache = fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPost)
    .sort((a, b) => b.date.getTime() - a.date.getTime());
  return cache;
}

/** Posts that belong on the website (and therefore in sitemap, RSS, llms.txt). */
export function getPublicPosts(): Post[] {
  const showDrafts = process.env.NODE_ENV !== "production";
  return getAllPosts().filter((p) => !p.emailOnly && (showDrafts || !p.draft));
}

export function getPublicPost(slug: string): Post | undefined {
  return getPublicPosts().find((p) => p.slug === slug);
}

/** Any post by slug, including email-only. Used by the send script. */
export function getPostForEmail(slug: string): Post | undefined {
  return getAllPosts().find((p) => p.slug === slug);
}

export function getTags(): { tag: string; count: number }[] {
  const counts = new Map<string, number>();
  for (const p of getPublicPosts()) {
    for (const t of p.tags) counts.set(t, (counts.get(t) ?? 0) + 1);
  }
  return [...counts]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}

export function tagSlug(tag: string) {
  return tag.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/** Tag pages with fewer posts than this are noindexed to avoid thin content. */
export const MIN_POSTS_TO_INDEX_TAG = 3;

export function postPath(slug: string) {
  return `/posts/${slug}`;
}

export function lastModified(p: Post) {
  return p.updated ?? p.date;
}
