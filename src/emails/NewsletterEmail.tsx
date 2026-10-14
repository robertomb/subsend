import { Body, Container, Head, Heading, Hr, Html, Link, Markdown, Preview, Text } from "react-email";
import { site } from "../lib/site";
import * as s from "./styles";

export type NewsletterEmailProps = {
  title: string;
  description: string;
  markdown: string; // links already absolute
  webUrl?: string; // omitted for email-only issues
};

// Resend replaces this with a per-recipient unsubscribe link in broadcasts.
const UNSUBSCRIBE_URL = "{{{RESEND_UNSUBSCRIBE_URL}}}";

export default function NewsletterEmail({ title, description, markdown, webUrl }: NewsletterEmailProps) {
  return (
    <Html lang="en">
      <Head>
        <meta name="color-scheme" content="light dark" />
        <meta name="supported-color-schemes" content="light dark" />
      </Head>
      <Preview>{description}</Preview>
      <Body style={s.body}>
        <Container style={s.container}>
          {webUrl && (
            <Text style={{ ...s.muted, textAlign: "right" }}>
              <Link href={webUrl} style={{ color: "#6b6b6b" }}>
                Read on the web
              </Link>
            </Text>
          )}

          <Heading as="h1" style={{ fontSize: "28px", lineHeight: "1.25", margin: "8px 0 8px" }}>
            {title}
          </Heading>
          <Text style={{ ...s.text, color: "#6b6b6b", fontSize: "19px", lineHeight: "1.45" }}>
            {description}
          </Text>

          <Markdown
            markdownContainerStyles={{ fontFamily: s.font }}
            markdownCustomStyles={{
              p: s.text,
              li: { fontSize: "17px", lineHeight: "1.65", margin: "0 0 8px" },
              h2: { fontSize: "22px", lineHeight: "1.3", margin: "32px 0 12px" },
              h3: { fontSize: "19px", lineHeight: "1.3", margin: "28px 0 8px" },
              link: s.link,
              blockQuote: {
                margin: "0 0 20px",
                padding: "0 0 0 16px",
                borderLeft: "3px solid #e6e6e6",
                color: "#555555",
              },
              image: { maxWidth: "100%", height: "auto", borderRadius: "6px" },
              codeInline: {
                fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                fontSize: "15px",
                background: "#f3f3f3",
                padding: "1px 4px",
                borderRadius: "4px",
              },
              codeBlock: {
                fontFamily: "ui-monospace, Menlo, Consolas, monospace",
                fontSize: "14px",
                lineHeight: "1.5",
                background: "#f6f8fa",
                padding: "12px 16px",
                borderRadius: "6px",
                overflowX: "auto",
              },
              hr: s.hr,
            }}
          >
            {markdown}
          </Markdown>

          <Text style={s.text}>— {site.author.name}</Text>

          <Hr style={s.hr} />
          <Text style={s.muted}>
            You&apos;re getting this because you subscribed at{" "}
            <Link href={site.url} style={{ color: "#6b6b6b" }}>
              {new URL(site.url).hostname}
            </Link>
            . Just hit reply to reach me.
          </Text>
          <Text style={s.muted}>
            <Link href={UNSUBSCRIBE_URL} style={{ color: "#6b6b6b" }}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

NewsletterEmail.PreviewProps = {
  title: "Hello, world",
  description: "Why I'm running my own newsletter on Resend.",
  markdown: [
    "This is a **preview**.",
    "## A heading",
    `Some text with a [link](${site.url}).`,
    "- One\n- Two",
    "```ts\nconst x = 1;\n```",
  ].join("\n\n"),
  webUrl: `${site.url}/posts/hello-world`,
} satisfies NewsletterEmailProps;
