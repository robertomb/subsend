import { getPublicPosts } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";
import { absolutizeLinks, rssXml } from "@/lib/feeds";

export const dynamic = "force-static";

export async function GET() {
  const posts = getPublicPosts().slice(0, 50);
  const items = await Promise.all(
    posts.map(async (post) => ({ post, html: await markdownToHtml(absolutizeLinks(post.content)) })),
  );
  return new Response(rssXml(items), {
    headers: { "Content-Type": "application/rss+xml; charset=utf-8" },
  });
}
