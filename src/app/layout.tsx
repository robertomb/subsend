import type { Metadata, Viewport } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import { site } from "@/lib/site";
import { SocialLinks } from "@/components/SocialLinks";
import { Colophon } from "@/components/Colophon";
import { navPages } from "@/lib/pages";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: site.title, template: `%s · ${site.name}` },
  description: site.description,
  authors: [{ name: site.author.name, url: site.url }],
  creator: site.author.name,
  alternates: {
    canonical: "/",
    types: {
      "application/rss+xml": [{ url: "/rss.xml", title: `${site.brand} — RSS` }],
    },
  },
  openGraph: {
    type: "website",
    siteName: site.brand,
    locale: site.locale,
    url: "/",
  },
  twitter: { card: "summary_large_image" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#111111" },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang={site.language}>
      <head>
        <link rel="alternate" type="text/plain" href="/llms.txt" title="llms.txt" />
      </head>
      <body>
        <a className="skip" href="#main">
          Skip to content
        </a>
        <header className="site-header">
          <Link href="/" className="site-name">
            {site.brand}
          </Link>
          <nav aria-label="Main">
            <Link href="/posts">Archive</Link>
            <Link href="/about">About</Link>
            {navPages().map((p) => (
              <Link key={p.slug} href={`/${p.slug}`}>
                {p.navLabel ?? p.title}
              </Link>
            ))}
            <Link href="/#subscribe" className="nav-cta">
              Subscribe
            </Link>
          </nav>
        </header>
        <main id="main">{children}</main>
        <footer className="site-footer">
          <SocialLinks />
          <Colophon />
        </footer>
        <Analytics />
      </body>
    </html>
  );
}
