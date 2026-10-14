import { site, absoluteUrl, sameAs } from "./site";
import { getPublicPosts, lastModified, postPath, type Post } from "./posts";
import { isoDate } from "./format";

/** A post as clean, self-describing Markdown, for LLMs and anyone who wants the source. */
export function postToMarkdown(post: Post) {
  const url = absoluteUrl(postPath(post.slug));
  return [
    `# ${post.title}`,
    "",
    `> ${post.description}`,
    "",
    `- Author: ${site.author.name} (${site.url})`,
    `- Published: ${isoDate(post.date)}`,
    ...(post.updated ? [`- Updated: ${isoDate(post.updated)}`] : []),
    ...(post.tags.length ? [`- Tags: ${post.tags.join(", ")}`] : []),
    `- Canonical URL: ${url}`,
    "",
    absolutizeLinks(post.content.trim()),
    "",
  ].join("\n");
}

/** Rewrites root-relative Markdown links/images so they work outside the site. */
export function absolutizeLinks(markdown: string) {
  return markdown.replace(/(\]\()(\/[^)\s]*)/g, (_, open, path) => open + absoluteUrl(path));
}

/** https://llmstxt.org — a curated index that tells LLMs what this site is and where things are. */
export function llmsTxt() {
  const posts = getPublicPosts();
  return [
    `# ${site.brand}: ${site.author.name}'s newsletter`,
    "",
    `> ${site.description}`,
    "",
    `${site.author.name}. ${site.author.bio}`,
    "",
    "Every post is available as Markdown by appending `.md` to its URL.",
    "",
    "## Archive",
    "",
    ...posts.map((p) => `- [${p.title}](${absoluteUrl(`${postPath(p.slug)}.md`)}): ${p.description}`),
    "",
    "## About",
    "",
    `- [About ${site.author.name}](${absoluteUrl("/about")})`,
    `- [How this newsletter is built](${absoluteUrl("/colophon")})`,
    `- [RSS feed](${absoluteUrl("/rss.xml")})`,
    `- [Full text of all posts](${absoluteUrl("/llms-full.txt")})`,
    ...sameAs.map((href) => `- [${new URL(href).hostname}](${href})`),
    "",
  ].join("\n");
}

export function llmsFullTxt() {
  return [
    `# ${site.author.name} — all posts`,
    "",
    `> ${site.description}`,
    "",
    ...getPublicPosts().map((p) => postToMarkdown(p) + "\n---\n"),
  ].join("\n");
}

const escapeXml = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function rssXml(items: { post: Post; html: string }[]) {
  const updated = items[0] ? lastModified(items[0].post) : new Date();
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
<channel>
  <title>${escapeXml(`${site.brand} — ${site.author.name}`)}</title>
  <link>${site.url}</link>
  <description>${escapeXml(site.description)}</description>
  <language>${site.language}</language>
  <lastBuildDate>${updated.toUTCString()}</lastBuildDate>
  <atom:link href="${absoluteUrl("/rss.xml")}" rel="self" type="application/rss+xml"/>
${items
  .map(({ post, html }) => {
    const url = absoluteUrl(postPath(post.slug));
    return `  <item>
    <title>${escapeXml(post.title)}</title>
    <link>${url}</link>
    <guid isPermaLink="true">${url}</guid>
    <pubDate>${post.date.toUTCString()}</pubDate>
    <dc:creator>${escapeXml(site.author.name)}</dc:creator>
    <description>${escapeXml(post.description)}</description>
${post.tags.map((t) => `    <category>${escapeXml(t)}</category>`).join("\n")}
    <content:encoded><![CDATA[${html.replaceAll("]]>", "]]]]><![CDATA[>")}]]></content:encoded>
  </item>`;
  })
  .join("\n")}
</channel>
</rss>
`;
}
