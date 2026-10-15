import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

// Static pages: every content/pages/<slug>.md becomes /<slug>.
// Use them for things like /now, /uses or /colophon.

const PAGES_DIR = path.join(process.cwd(), "content/pages");

const frontmatterSchema = z.object({
  title: z.string().min(1),
  // Meta description and llms.txt summary.
  description: z.string().min(1).max(200),
  // Show a link to this page in the header menu.
  nav: z.boolean().default(false),
  // Header menu label, if it should differ from the title.
  navLabel: z.string().optional(),
  // Order among pages in the header menu (lowest first).
  order: z.number().default(100),
  // Small label above the title, e.g. "Colophon".
  eyebrow: z.string().optional(),
  // Show the subscribe box at the end of the page.
  subscribe: z.boolean().default(false),
  // Drafts show in `pnpm dev` only.
  draft: z.boolean().default(false),
  updated: z.coerce.date().optional(),
});

export type Page = z.infer<typeof frontmatterSchema> & { slug: string; content: string };

// Routes that already exist; a page with one of these slugs would never be reachable.
const RESERVED = new Set([
  "about", "posts", "tags", "subscribe", "api", "md",
  "rss.xml", "sitemap.xml", "robots.txt", "llms.txt", "llms-full.txt", "indexnow-key.txt",
  "icon", "apple-icon", "opengraph-image",
]);
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

function readPage(file: string): Page {
  const slug = file.replace(/\.md$/, "");
  if (!SLUG_RE.test(slug)) throw new Error(`Invalid page slug "${slug}": use lowercase-kebab-case filenames.`);
  if (RESERVED.has(slug)) throw new Error(`content/pages/${file}: "/${slug}" is already used by the site. Pick another name.`);
  const { data, content } = matter(fs.readFileSync(path.join(PAGES_DIR, file), "utf8"));
  const parsed = frontmatterSchema.safeParse(data);
  if (!parsed.success) throw new Error(`Invalid frontmatter in content/pages/${file}:\n${z.prettifyError(parsed.error)}`);
  return { ...parsed.data, slug, content };
}

/** Published pages (drafts too in development), sorted by `order` then title. */
export function getPages(): Page[] {
  if (!fs.existsSync(PAGES_DIR)) return [];
  const showDrafts = process.env.NODE_ENV !== "production";
  return fs
    .readdirSync(PAGES_DIR)
    .filter((f) => f.endsWith(".md"))
    .map(readPage)
    .filter((p) => showDrafts || !p.draft)
    .sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
}

export function getPage(slug: string) {
  return getPages().find((p) => p.slug === slug);
}

export function navPages() {
  return getPages().filter((p) => p.nav);
}
