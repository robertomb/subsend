import type { Metadata } from "next";
import Link from "next/link";

// Landing pages for the no-JS subscribe flow. Never indexed.
const pages = {
  "check-email": {
    title: "Check your inbox",
    body: "I just sent you a confirmation link. Click it to finish subscribing. It expires in 48 hours.",
  },
  confirmed: {
    title: "You're subscribed",
    body: "Thanks! The next post will land in your inbox.",
  },
  invalid: {
    title: "That link didn't work",
    body: "The confirmation link is invalid or has expired. Try subscribing again.",
  },
  error: {
    title: "Something went wrong",
    body: "I couldn't process that request. Please try again in a minute.",
  },
} as const;

type Status = keyof typeof pages;

export const dynamicParams = false;

export function generateStaticParams() {
  return Object.keys(pages).map((status) => ({ status }));
}

export async function generateMetadata({ params }: PageProps<"/subscribe/[status]">): Promise<Metadata> {
  const page = pages[(await params).status as Status];
  return { title: page.title, robots: { index: false, follow: false } };
}

export default async function SubscribeStatus({ params }: PageProps<"/subscribe/[status]">) {
  const page = pages[(await params).status as Status];
  return (
    <>
      <h1>{page.title}</h1>
      <p>{page.body}</p>
      <p>
        <Link href="/">← Back home</Link>
      </p>
    </>
  );
}
