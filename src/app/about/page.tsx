import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Image from "next/image";
import { site } from "@/lib/site";
import { markdownToHtml } from "@/lib/markdown";
import { breadcrumbJsonLd, graph, personJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { SubscribeForm } from "@/components/SubscribeForm";

export const metadata: Metadata = {
  title: "About",
  description: `${site.author.name}: ${site.author.bio}`,
  alternates: { canonical: "/about" },
  openGraph: { type: "profile", url: "/about" },
};

export default async function AboutPage() {
  // Edit content/about.md. Plain "who I am, what I've done, what I write about"
  // sentences are exactly what search engines and LLMs quote.
  const html = await markdownToHtml(fs.readFileSync(path.join(process.cwd(), "content/about.md"), "utf8"));

  return (
    <>
      <JsonLd
        data={graph(
          { "@type": "ProfilePage", mainEntity: { "@id": personJsonLd()["@id"] } },
          personJsonLd(),
          breadcrumbJsonLd([{ name: "Home", path: "/" }, { name: "About", path: "/about" }]),
        )}
      />
      <article>
        <header className="about-header">
          <Image src={site.author.photo} alt={`Portrait of ${site.author.name}`} width={120} height={120} priority />
          <h1>About</h1>
        </header>
        <div className="prose" dangerouslySetInnerHTML={{ __html: html }} />
      </article>
      <SubscribeForm />
    </>
  );
}
