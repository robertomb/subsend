// Served at /posts/<slug>.md via a rewrite in next.config.ts.
import { getPublicPost, getPublicPosts, postPath } from "@/lib/posts";
import { postToMarkdown } from "@/lib/feeds";
import { absoluteUrl } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicPosts().map((p) => ({ slug: p.slug }));
}

export async function GET(_req: Request, ctx: RouteContext<"/md/[slug]">) {
  const post = getPublicPost((await ctx.params).slug);
  if (!post) return new Response("Not found", { status: 404 });
  return new Response(postToMarkdown(post), {
    headers: {
      "Content-Type": "text/markdown; charset=utf-8",
      // Point search engines at the HTML page so the two never compete.
      Link: `<${absoluteUrl(postPath(post.slug))}>; rel="canonical"`,
    },
  });
}
