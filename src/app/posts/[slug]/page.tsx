import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPublicPost, getPublicPosts, lastModified, postPath, tagSlug } from "@/lib/posts";
import { markdownToHtml } from "@/lib/markdown";
import { formatDate, isoDate } from "@/lib/format";
import { site } from "@/lib/site";
import { blogPostingJsonLd, breadcrumbJsonLd, graph } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { AuthorBio } from "@/components/AuthorBio";
import { SubscribeForm } from "@/components/SubscribeForm";

// Only posts that exist at build time. Anything else is a real 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return getPublicPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/posts/[slug]">): Promise<Metadata> {
  const post = getPublicPost((await params).slug);
  if (!post) return {};
  const path = postPath(post.slug);
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: {
      canonical: post.canonical ?? path,
      types: { "text/markdown": `${path}.md` },
    },
    openGraph: {
      type: "article",
      url: path,
      title: post.title,
      description: post.description,
      publishedTime: post.date.toISOString(),
      modifiedTime: lastModified(post).toISOString(),
      authors: [site.url],
      tags: post.tags,
    },
    robots: post.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function PostPage({ params }: PageProps<"/posts/[slug]">) {
  const post = getPublicPost((await params).slug);
  if (!post) notFound();

  const html = await markdownToHtml(post.content);
  const path = postPath(post.slug);
  const modified = lastModified(post);
  const wasUpdated = isoDate(modified) !== isoDate(post.date);

  return (
    <>
      <JsonLd
        data={graph(
          blogPostingJsonLd(post),
          breadcrumbJsonLd([
            { name: "Home", path: "/" },
            { name: "Posts", path: "/posts" },
            { name: post.title, path },
          ]),
        )}
      />
      <article>
        <header className="post-header">
          <h1>{post.title}</h1>
          <p className="subtitle">{post.description}</p>
          <div className="post-meta">
            <span>
              By <Link href="/about">{site.author.name}</Link>
            </span>
            <time dateTime={post.date.toISOString()}>{formatDate(post.date)}</time>
            {wasUpdated && (
              <span>
                Updated <time dateTime={modified.toISOString()}>{formatDate(modified)}</time>
              </span>
            )}
            <span>{post.readingMinutes} min read</span>
            <a href={`${path}.md`}>Markdown</a>
          </div>
        </header>

        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />

        {post.tags.length > 0 && (
          <ul className="tags small" aria-label="Tags">
            {post.tags.map((t) => (
              <li key={t}>
                <Link href={`/tags/${tagSlug(t)}`}>#{t}</Link>
              </li>
            ))}
          </ul>
        )}
      </article>

      <AuthorBio />
      <SubscribeForm title="Thanks for reading" blurb="If this was useful, I can send the next one to your inbox." />
    </>
  );
}
