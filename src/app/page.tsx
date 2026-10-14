import Image from "next/image";
import Link from "next/link";
import { getPublicPosts } from "@/lib/posts";
import { site } from "@/lib/site";
import { graph, personJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { JsonLd } from "@/components/JsonLd";
import { PostList } from "@/components/PostList";
import { HeroSubscribe } from "@/components/SubscribeForm";

const LATEST = 8;

// The home page: a short intro and the subscribe form first,
// then the best posts, then the latest ones leading into the archive.
export default function Home() {
  const posts = getPublicPosts();
  const featured = posts.filter((p) => p.featured).slice(0, 3);

  return (
    <>
      <JsonLd data={graph(personJsonLd(), websiteJsonLd())} />

      <section className="hero">
        <Image src={site.author.photo} alt={`Portrait of ${site.author.name}`} width={88} height={88} priority />
        <p className="eyebrow">
          {site.brand} · {site.descriptor} by <Link href="/about">{site.author.name}</Link>
        </p>
        <h1>{site.newsletter.headline}</h1>
        <p className="lede">{site.newsletter.pitch}</p>
        <HeroSubscribe />
      </section>

      {featured.length > 0 && (
        <section aria-labelledby="start-here">
          <h2 className="section-title" id="start-here">
            Start here
          </h2>
          <PostList posts={featured} descriptions />
        </section>
      )}

      {posts.length > 0 && (
        <section aria-labelledby="latest">
          <h2 className="section-title" id="latest">
            Latest posts
          </h2>
          <PostList posts={posts.slice(0, LATEST)} descriptions />
          <p className="small archive-link">
            <Link href="/posts">Browse the full archive →</Link>
          </p>
        </section>
      )}
    </>
  );
}
