import { z } from "zod";
import { resend } from "@/lib/resend";
import { createConfirmToken } from "@/lib/token";
import { absoluteUrl, site } from "@/lib/site";
import ConfirmEmail from "@/emails/ConfirmEmail";

const emailSchema = z.email().max(254);

const redirectTo = (status: string) =>
  new Response(null, { status: 303, headers: { Location: `/subscribe/${status}` } });

export async function POST(req: Request) {
  const form = await req.formData();

  // Honeypot: bots fill every field. Pretend it worked.
  if (form.get("company")) return redirectTo("check-email");

  const parsed = emailSchema.safeParse(String(form.get("email") ?? "").trim().toLowerCase());
  if (!parsed.success) return redirectTo("invalid");
  const email = parsed.data;

  const confirmUrl = absoluteUrl(`/api/confirm?token=${createConfirmToken(email)}`);
  const { error } = await resend().emails.send({
    from: site.newsletter.from,
    to: email,
    replyTo: site.newsletter.replyTo,
    subject: `Confirm your subscription to ${site.brand}`,
    react: ConfirmEmail({ confirmUrl }),
  });

  if (error) {
    console.error("subscribe: send failed", error);
    return redirectTo("error");
  }
  return redirectTo("check-email");
}
