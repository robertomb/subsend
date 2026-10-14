// Your newsletter's identity and settings. This is the one file to edit when
// you make this project yours: everything SEO-related (metadata, JSON-LD,
// llms.txt, RSS), the emails and the incoming-mail setup read from here.
// Your posts and pages live in content/, your photo in public/avatar.jpg.

export const site = {
  url: "https://example.com", // your domain, no trailing slash
  brand: "example", // wordmark in the header and site name
  name: "Your Name", // used in <title> templates and bylines
  title: "example — A newsletter by Your Name", // home page <title>
  description:
    "Your Name's newsletter on the topics you write about. One or two sentences; this is what search engines show.",
  locale: "en_US",
  language: "en",
  author: {
    name: "Your Name",
    alternateName: "", // optional: full legal name, so search engines connect both
    email: "you@example.com",
    jobTitle: "", // optional
    worksFor: { name: "", url: "" }, // optional: leave empty if not relevant
    photo: "/avatar.jpg",
    bio: "One line about you. Shown under every post and in llms.txt.",
    // Topics you want to be associated with. Feeds Person.knowsAbout.
    knowsAbout: ["Topic one", "Topic two"],
    alumniOf: "", // optional
    homeLocation: "", // optional, e.g. "Lisbon, Portugal"
    // Third-party pages about you. Feeds Person.subjectOf (independent corroboration).
    mentions: [] as { name: string; url: string }[],
    // Your profiles. Shown as footer icons, linked with rel="me", and used as
    // Person.sameAs so search engines and LLMs connect your identity across sites.
    // Leave a value empty to hide its icon.
    social: {
      linkedin: "",
      twitter: "",
    },
  },
  newsletter: {
    // Landing page copy.
    headline: "Notes on the things I'm learning.",
    pitch: "A short paragraph on what you write about and why someone should subscribe.",
    // Optional: shown under the subscribe form, e.g. "A new issue every other week."
    cadence: "",
    // Send from a dedicated subdomain so your newsletter's reputation stays
    // separate from your regular email. The domain must be verified in Resend.
    from: "Your Name <you@news.example.com>",
    replyTo: "you@example.com",
  },
  // How incoming mail (replies, mail to your addresses) is handled. Pick one,
  // both, or neither — they're independent. See docs/resend.md.
  inbound: {
    // Resend Inboxes (beta): read and reply to threads in Resend, via the
    // dashboard, CLI or MCP. Nothing in this codebase depends on it; this flag
    // only documents the choice. Create the inbox with `resend inboxes create`.
    inboxes: false,
    // Webhook forwarding: /api/inbound forwards each received email to
    // INBOX_FORWARD_TO. The route is live only when this is true AND both
    // RESEND_WEBHOOK_SECRET and INBOX_FORWARD_TO are set; otherwise it 404s.
    forwarding: false,
    // Only mail addressed to these domains is forwarded. The webhook fires for
    // every receiving domain on the Resend account, so keep this list tight.
    domains: ["example.com", "news.example.com"],
    // Sender for forwarded mail. Must be on a verified sending domain.
    forwardFrom: "Inbox <inbox@news.example.com>",
  },
} as const;
