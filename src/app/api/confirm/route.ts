import { resend, segmentId } from "@/lib/resend";
import { verifyConfirmToken } from "@/lib/token";

const redirectTo = (status: string) =>
  new Response(null, { status: 303, headers: { Location: `/subscribe/${status}` } });

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token") ?? "";
  const email = verifyConfirmToken(token);
  if (!email) return redirectTo("invalid");

  const r = resend();
  const created = await r.contacts.create({
    email,
    unsubscribed: false,
    segments: [{ id: segmentId() }],
  });

  if (created.error) {
    // Most likely the contact already exists (e.g. re-subscribing after an
    // unsubscribe). Resubscribe them and make sure they're in the segment.
    const updated = await r.contacts.update({ email, unsubscribed: false });
    if (updated.error) {
      console.error("confirm: create and update failed", created.error, updated.error);
      return redirectTo("error");
    }
    await r.contacts.segments.add({ email, segmentId: segmentId() });
  }

  return redirectTo("confirmed");
}
