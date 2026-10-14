/**
 * Send a post as a newsletter issue through Resend Broadcasts.
 *
 *   pnpm send <slug> --test     Send only to you (NEWSLETTER_TEST_TO) to proof it.
 *   pnpm send <slug>            Send to all subscribers, after a typed confirmation.
 *
 * Safety: refuses drafts, posts without `newsletter: true`, posts that already
 * have `sentAt`, and slugs that already have a Resend broadcast. For public
 * posts it also checks the web page is live, so "Read on the web" never 404s.
 */
import fs from "node:fs";
import readline from "node:readline/promises";
import { render, toPlainText } from "react-email";
import { getPostForEmail, postPath } from "../src/lib/posts";
import { absolutizeLinks } from "../src/lib/feeds";
import { absoluteUrl, site } from "../src/lib/site";
import { resend, segmentId } from "../src/lib/resend";
import NewsletterEmail from "../src/emails/NewsletterEmail";

const args = process.argv.slice(2);
const slug = args.find((a) => !a.startsWith("--"));
const isTest = args.includes("--test");

function fail(msg: string): never {
  console.error(`✗ ${msg}`);
  process.exit(1);
}

async function main() {
  if (!slug) fail("Usage: pnpm send <slug> [--test]");
  const post = getPostForEmail(slug);
  if (!post) fail(`No post at content/posts/${slug}.md`);
  if (!post.newsletter) fail("This post doesn't have `newsletter: true`.");
  if (!isTest && post.draft) fail("This post is a draft. Remove `draft: true` first.");
  if (!isTest && post.sentAt) fail(`Already sent on ${post.sentAt.toISOString()}.`);

  const webUrl = post.emailOnly ? undefined : absoluteUrl(postPath(post.slug));
  const props = {
    title: post.title,
    description: post.description,
    markdown: absolutizeLinks(post.content.trim()),
    webUrl,
  };
  const html = await render(NewsletterEmail(props));
  const text = toPlainText(html);
  const r = resend();

  if (isTest) {
    const to = process.env.NEWSLETTER_TEST_TO || site.newsletter.replyTo;
    const { data, error } = await r.emails.send({
      from: site.newsletter.from,
      replyTo: site.newsletter.replyTo,
      to,
      subject: `[TEST] ${post.title}`,
      // The unsubscribe placeholder only works in broadcasts.
      html: html.replaceAll("{{{RESEND_UNSUBSCRIBE_URL}}}", site.url),
      text: text.replaceAll("{{{RESEND_UNSUBSCRIBE_URL}}}", site.url),
    });
    if (error) fail(`Resend error: ${error.message}`);
    console.log(`✓ Test sent to ${to} (${data?.id})`);
    return;
  }

  const name = `post:${post.slug}`;
  const existing = await r.broadcasts.list();
  if (existing.error) fail(`Resend error: ${existing.error.message}`);
  const dupe = existing.data?.data.find((b) => b.name === name);
  if (dupe) fail(`A broadcast named "${name}" already exists (${dupe.status}, ${dupe.id}).`);

  if (webUrl) {
    const res = await fetch(webUrl, { method: "HEAD" });
    if (!res.ok) fail(`${webUrl} returned ${res.status}. Deploy the post before sending.`);
  }

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const answer = await rl.question(
    `Send "${post.title}" to every subscriber in segment ${segmentId()}? Type the slug to confirm: `,
  );
  rl.close();
  if (answer.trim() !== post.slug) fail("Cancelled.");

  const { data, error } = await r.broadcasts.create({
    name,
    segmentId: segmentId(),
    from: site.newsletter.from,
    replyTo: site.newsletter.replyTo,
    subject: post.title,
    previewText: post.description,
    html,
    text,
    send: true,
  });
  if (error) fail(`Resend error: ${error.message}`);

  markSent(post.filePath, new Date());
  console.log(`✓ Broadcast ${data?.id} sent. Wrote sentAt to ${post.filePath}. Commit it.`);
}

/** Insert `sentAt` into the frontmatter without reformatting anything else. */
function markSent(filePath: string, at: Date) {
  const src = fs.readFileSync(filePath, "utf8");
  const end = src.indexOf("\n---", 3);
  if (!src.startsWith("---") || end === -1) fail(`Couldn't find frontmatter in ${filePath}`);
  fs.writeFileSync(filePath, `${src.slice(0, end)}\nsentAt: ${at.toISOString()}${src.slice(end)}`);
}

main();
