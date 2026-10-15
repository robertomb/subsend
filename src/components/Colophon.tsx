import Link from "next/link";
import { site } from "@/lib/site";
import { getPage } from "@/lib/pages";

const SUBSEND_URL = "https://github.com/robertomb/subsend";

// Footer credit: what sends the email and what the site is built with.
// If you add content/pages/colophon.md, it links to your own "how it's built" page.
export function Colophon() {
  const resend = `https://resend.com/?ref=${encodeURIComponent(site.brand)}`;
  const ownColophon = getPage("colophon");
  return (
    <p className="colophon">
      Sent with{" "}
      <a href={resend} rel="noopener">
        Resend
      </a>
      .{" "}
      {ownColophon ? (
        <>
          Want {site.descriptor} like this? <Link href="/colophon">Here&apos;s how it&apos;s built</Link>.
        </>
      ) : (
        <>
          Built with{" "}
          <a href={SUBSEND_URL} rel="noopener">
            Subsend
          </a>
          .
        </>
      )}
    </p>
  );
}
