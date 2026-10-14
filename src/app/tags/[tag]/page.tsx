import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublicPosts, getTags, MIN_POSTS_TO_INDEX_TAG, tagSlug } from "@/lib/posts";
import { breadcrumbJsonLd, graph } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { PostList } from "@/components/PostList";

export const dynamicParams = false;

export function generateStaticParams() {
  return getTags().map(({ tag }) => ({ tag: tagSlug(tag) }));
}

function resolve(slug: string) {
  const match = getTags().find(({ tag }) => tagSlug(tag) === slug);
  if (!match) return undefined;
  return { ...match, posts: getPublicPosts().filter((p) => p.tags.includes(match.tag)) };
}

export async function generateMetadata({ params }: PageProps<"/tags/[tag]">): Promise<Metadata> {
  const slug = (await params).tag;
  const t = resolve(slug);
  if (!t) return {};
  return {
    title: `#${t.tag}`,
    description: `Posts tagged “${t.tag}”.`,
    alternates: { canonical: `/tags/${slug}` },
    // Thin tag pages hurt more than they help; let them in once they have substance.
    robots: t.count < MIN_POSTS_TO_INDEX_TAG ? { index: false, follow: true } : undefined,
  };
}

export default async function TagPage({ params }: PageProps<"/tags/[tag]">) {
  const slug = (await params).tag;
  const t = resolve(slug);
  if (!t) notFound();
  return (
    <>
      <JsonLd
        data={graph(
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Posts", path: "/posts" },
            { name: `#${t.tag}`, path: `/tags/${slug}` },
          ]),
        )}
      />
      <h1>#{t.tag}</h1>
      <PostList posts={t.posts} descriptions />
    </>
  );
}
