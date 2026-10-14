import { site, absoluteUrl, sameAs } from "./site";
import { lastModified, postPath, type Post } from "./posts";

// schema.org structured data. Search engines use it for rich results;
// LLM crawlers use it to attribute content to a real, consistent author.

const personId = absoluteUrl("/#person");
const websiteId = absoluteUrl("/#website");

export function personJsonLd() {
  const a = site.author;
  // Optional fields in site.config.ts are left out when empty.
  return {
    "@type": "Person",
    "@id": personId,
    name: a.name,
    ...(a.alternateName ? { alternateName: a.alternateName } : {}),
    url: site.url,
    email: `mailto:${a.email}`,
    image: absoluteUrl(a.photo),
    ...(a.jobTitle ? { jobTitle: a.jobTitle } : {}),
    ...(a.worksFor.name ? { worksFor: { "@type": "Organization", ...a.worksFor } } : {}),
    description: a.bio,
    ...(a.knowsAbout.length ? { knowsAbout: a.knowsAbout } : {}),
    ...(a.alumniOf ? { alumniOf: { "@type": "CollegeOrUniversity", name: a.alumniOf } } : {}),
    ...(a.homeLocation ? { homeLocation: { "@type": "Place", name: a.homeLocation } } : {}),
    ...(a.mentions.length
      ? { subjectOf: a.mentions.map((m) => ({ "@type": "Article", headline: m.name, url: m.url })) }
      : {}),
    ...(sameAs.length ? { sameAs } : {}),
  };
}

export function websiteJsonLd() {
  return {
    "@type": "WebSite",
    "@id": websiteId,
    url: site.url,
    name: site.brand,
    alternateName: `${site.author.name}’s newsletter`,
    description: site.description,
    inLanguage: site.language,
    publisher: { "@id": personId },
  };
}

export function blogPostingJsonLd(post: Post) {
  const url = absoluteUrl(postPath(post.slug));
  return {
    "@type": "BlogPosting",
    "@id": `${url}#article`,
    mainEntityOfPage: url,
    url,
    headline: post.title,
    description: post.description,
    datePublished: post.date.toISOString(),
    dateModified: lastModified(post).toISOString(),
    inLanguage: site.language,
    keywords: post.tags.join(", "),
    wordCount: post.content.trim().split(/\s+/).length,
    image: absoluteUrl(`${postPath(post.slug)}/opengraph-image`),
    author: { "@id": personId },
    publisher: { "@id": personId },
    isPartOf: { "@id": websiteId },
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

/** Wraps nodes in a single @graph so entities can reference each other by @id. */
export function graph(...nodes: object[]) {
  return { "@context": "https://schema.org", "@graph": nodes };
}
