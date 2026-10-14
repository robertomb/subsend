import { Resend } from "resend";

let client: Resend | undefined;

export function resend() {
  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set.");
  client ??= new Resend(process.env.RESEND_API_KEY);
  return client;
}

/** The Resend segment that holds confirmed newsletter subscribers. */
export function segmentId() {
  const id = process.env.RESEND_SEGMENT_ID;
  if (!id) throw new Error("RESEND_SEGMENT_ID is not set.");
  return id;
}
