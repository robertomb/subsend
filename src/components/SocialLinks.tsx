import { site } from "@/lib/site";

// Inline SVG icons: no icon font, no extra requests. Brand marks from Simple Icons,
// outline icons from Lucide.
const icons = {
  linkedin: (
    <path
      fill="currentColor"
      d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 1 1 0-4.125 2.062 2.062 0 0 1 0 4.125zM7.119 20.452H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"
    />
  ),
  twitter: (
    <path
      fill="currentColor"
      d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932ZM17.61 20.644h2.039L6.486 3.24H4.298Z"
    />
  ),
  email: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
    </g>
  ),
  rss: (
    <g fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 11a9 9 0 0 1 9 9" />
      <path d="M4 4a16 16 0 0 1 16 16" />
      <circle cx="5" cy="19" r="1" />
    </g>
  ),
};

type Link = { key: keyof typeof icons; href: string; label: string; rel?: string; type?: string };

export function SocialLinks() {
  const links: Link[] = [
    { key: "linkedin", href: site.author.social.linkedin, label: "LinkedIn", rel: "me" },
    { key: "twitter", href: site.author.social.twitter, label: "X (Twitter)", rel: "me" },
    { key: "email", href: `mailto:${site.author.email}`, label: "Email" },
    { key: "rss", href: "/rss.xml", label: "RSS feed", type: "application/rss+xml" },
  ];

  return (
    <ul className="social" aria-label="Elsewhere">
      {links
        .filter((l) => l.href)
        .map((l) => (
          <li key={l.key}>
            <a href={l.href} rel={l.rel} type={l.type} aria-label={l.label} title={l.label}>
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true" focusable="false">
                {icons[l.key]}
              </svg>
            </a>
          </li>
        ))}
    </ul>
  );
}
