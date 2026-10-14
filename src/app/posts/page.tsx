import type { Metadata } from "next";
import Link from "next/link";
import { getPublicPosts, getTags, tagSlug, type Post } from "@/lib/posts";
import { site } from "@/lib/site";
import { breadcrumbJsonLd, graph } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { PostList } from "@/components/PostList";
import { SubscribeForm } from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "Archive",
  description: `Every issue of ${site.brand}, ${site.author.name}'s newsletter on growth, startups and venture capital.`,
  alternates: { canonical: "/posts" },
};

function byYear(posts: Post[]) {
  const years = new Map<number, Post[]>();
  for (const p of posts) {
    const y = p.date.getUTCFullYear();
    years.set(y, [...(years.get(y) ?? []), p]);
  }
  return [...years];
}

export default function ArchivePage() {
  const posts = getPublicPosts();
  const tags = getTags();
  return (
    <>
      <JsonLd data={graph(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Archive", path: "/posts" }]))} />
      <h1>Archive</h1>
      <p className="muted">
        {posts.length} {posts.length === 1 ? "issue" : "issues"} on growth, startups and venture capital.
      </p>
      {tags.length > 0 && (
        <ul className="tags small" aria-label="Topics">
          {tags.map(({ tag, count }) => (
            <li key={tag}>
              <Link href={`/tags/${tagSlug(tag)}`}>
                #{tag} <span className="muted">({count})</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
      {byYear(posts).map(([year, list]) => (
        <section key={year} aria-labelledby={`y${year}`}>
          <h2 className="section-title" id={`y${year}`}>
            {year}
          </h2>
          <PostList posts={list} />
        </section>
      ))}
      <SubscribeForm />
    </>
  );
}
