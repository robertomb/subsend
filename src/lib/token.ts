import { createHmac, timingSafeEqual } from "node:crypto";

// Stateless double opt-in: the confirmation link carries the email and an
// expiry, signed with a server secret. No database row until they confirm.

const TTL_MS = 48 * 60 * 60 * 1000;

function secret() {
  const s = process.env.SUBSCRIBE_SECRET;
  if (!s || s.length < 32) throw new Error("SUBSCRIBE_SECRET must be set (32+ chars).");
  return s;
}

const sign = (payload: string) => createHmac("sha256", secret()).update(payload).digest("base64url");

export function createConfirmToken(email: string, now = Date.now()) {
  const payload = Buffer.from(JSON.stringify({ e: email, x: now + TTL_MS })).toString("base64url");
  return `${payload}.${sign(payload)}`;
}

export function verifyConfirmToken(token: string, now = Date.now()): string | null {
  const [payload, sig] = token.split(".");
  if (!payload || !sig) return null;
  const expected = Buffer.from(sign(payload));
  const given = Buffer.from(sig);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) return null;
  try {
    const { e, x } = JSON.parse(Buffer.from(payload, "base64url").toString());
    if (typeof e !== "string" || typeof x !== "number" || x < now) return null;
    return e;
  } catch {
    return null;
  }
}
