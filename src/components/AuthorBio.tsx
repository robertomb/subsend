import Image from "next/image";
import Link from "next/link";
import { site } from "@/lib/site";

// Shown under every post: a visible, consistent author signal for readers,
// search engines and LLMs.
export function AuthorBio() {
  return (
    <aside className="author" aria-label="About the author">
      <Image src={site.author.photo} alt={site.author.name} width={56} height={56} />
      <p>
        Written by <Link href="/about">{site.author.name}</Link>. {site.author.bio}
      </p>
    </aside>
  );
}
