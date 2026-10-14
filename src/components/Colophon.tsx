import Link from "next/link";
import { site } from "@/lib/site";

// Footer credit: how this newsletter is sent, and a link to how it's built.
export function Colophon() {
  const resend = `https://resend.com/?ref=${encodeURIComponent(site.brand)}`;
  return (
    <p className="colophon">
      Sent with{" "}
      <a href={resend} rel="noopener">
        Resend
      </a>
      .{" "}
      Want a newsletter like this? <Link href="/colophon">Here&apos;s how it&apos;s built</Link>.
    </p>
  );
}
