import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import { site } from "@/lib/site";
import { markdownToHtml } from "@/lib/markdown";
import { breadcrumbJsonLd, graph } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { SubscribeForm } from "@/components/SubscribeForm";

const title = "How this newsletter is built";
const description = `Why ${site.author.name} built ${site.brand} from scratch, and how it works: Markdown in Git, a static Next.js site, and email sent with Resend.`;

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: "/colophon" },
  openGraph: { type: "article", url: "/colophon", title, description },
};

export default async function ColophonPage() {
  // Edit content/colophon.md.
  const html = await markdownToHtml(fs.readFileSync(path.join(process.cwd(), "content/colophon.md"), "utf8"));

  return (
    <>
      <JsonLd
        data={graph(breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "Colophon", path: "/colophon" }]))}
      />
      <article>
        <header className="post-header">
          <p className="eyebrow">Colophon</p>
          <h1>{title}</h1>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <SubscribeForm />
    </>
  );
}
