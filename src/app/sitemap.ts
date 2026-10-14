import type { MetadataRoute } from "next";
import { getPublicPosts, getTags, lastModified, MIN_POSTS_TO_INDEX_TAG, postPath, tagSlug } from "@/lib/posts";
import { absoluteUrl } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getPublicPosts().filter((p) => !p.draft && !p.canonical);
  const latest = posts[0] ? lastModified(posts[0]) : new Date();

  return [
    { url: absoluteUrl("/"), lastModified: latest },
    { url: absoluteUrl("/posts"), lastModified: latest },
    { url: absoluteUrl("/about") },
    { url: absoluteUrl("/colophon") },
    ...posts.map((p) => ({ url: absoluteUrl(postPath(p.slug)), lastModified: lastModified(p) })),
    ...getTags()
      .filter((t) => t.count >= MIN_POSTS_TO_INDEX_TAG)
      .map((t) => ({ url: absoluteUrl(`/tags/${tagSlug(t.tag)}`) })),
  ];
}
