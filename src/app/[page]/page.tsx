import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPage, getPages } from "@/lib/pages";
import { markdownToHtml } from "@/lib/markdown";
import { breadcrumbJsonLd, graph } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { SubscribeForm } from "@/components/SubscribeForm";

// Static pages from content/pages/<slug>.md (see src/lib/pages.ts).
export const dynamicParams = false;

export function generateStaticParams() {
  return getPages().map((p) => ({ page: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[page]">): Promise<Metadata> {
  const page = getPage((await params).page);
  if (!page) return {};
  const path = `/${page.slug}`;
  return {
    title: page.title,
    description: page.description,
    alternates: { canonical: path },
    openGraph: { type: "article", url: path, title: page.title, description: page.description },
    robots: page.draft ? { index: false, follow: false } : undefined,
  };
}

export default async function StaticPage({ params }: PageProps<"/[page]">) {
  const page = getPage((await params).page);
  if (!page) notFound();
  const html = await markdownToHtml(page.content);

  return (
    <>
      <JsonLd
        data={graph(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: page.title, path: `/${page.slug}` }]))}
      />
      <article>
        <header className="post-header">
          {page.eyebrow && <p className="eyebrow">{page.eyebrow}</p>}
          <h1>{page.title}</h1>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      {page.subscribe && <SubscribeForm />}
    </>
  );
}
