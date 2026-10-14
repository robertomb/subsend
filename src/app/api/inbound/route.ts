import { resend } from "@/lib/resend";
import { site } from "@/lib/site";

// Optional Resend webhook for `email.received` (see `site.inbound`). Mail for
// your domains lands in Resend; this forwards it, untouched, to the personal
// inbox in INBOX_FORWARD_TO. Email content is untrusted: it is only passed
// along, never parsed or acted on.

const { forwarding, domains, forwardFrom } = site.inbound;
const forwardFromAddress = (forwardFrom.match(/<([^>]+)>/)?.[1] ?? forwardFrom).toLowerCase();

function addressDomain(address: string) {
  return (address.match(/<([^>]+)>/)?.[1] ?? address).toLowerCase().split("@")[1]?.trim();
}

function isForUs(addresses: string[]) {
  return addresses.some((a) => {
    const d = addressDomain(a);
    return !!d && (domains as readonly string[]).includes(d);
  });
}

export async function POST(req: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET;
  const forwardTo = process.env.INBOX_FORWARD_TO;
  // Forwarding is opt-in. Unconfigured deployments don't expose the endpoint.
  if (!forwarding || !secret || !forwardTo) return new Response("Not found", { status: 404 });

  // Signature verification needs the raw body.
  const payload = await req.text();
  let event;
  try {
    event = resend().webhooks.verify({
      payload,
      headers: {
        id: req.headers.get("svix-id") ?? "",
        timestamp: req.headers.get("svix-timestamp") ?? "",
        signature: req.headers.get("svix-signature") ?? "",
      },
      webhookSecret: secret,
    });
  } catch {
    return new Response("Invalid signature", { status: 400 });
  }

  if (event.type !== "email.received") return new Response("OK");

  const { email_id, from, to, cc, received_for } = event.data;
  // Acknowledge (200) mail for other domains on the account, but never touch it.
  if (!isForUs([...(received_for ?? []), ...(to ?? []), ...(cc ?? [])])) return new Response("OK");
  // Never forward our own forwards (prevents loops if something bounces back).
  if (from.toLowerCase().includes(forwardFromAddress)) return new Response("OK");

  const { error } = await resend().emails.receiving.forward(
    { emailId: email_id, to: forwardTo, from: forwardFrom },
    // Resend retries webhooks; the key makes a retry forward the email only once.
    { idempotencyKey: `forward-${email_id}` },
  );
  if (error) {
    console.error("inbound: forward failed", email_id, error);
    // Non-2xx so Resend retries later.
    return new Response("Forward failed", { status: 502 });
  }
  return new Response("OK");
}
