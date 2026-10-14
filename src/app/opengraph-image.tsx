import { site } from "@/lib/site";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = site.title;

export default function Image() {
  return ogImage({ title: site.newsletter.headline, subtitle: `${site.brand} — ${site.descriptor} by ${site.author.name}` });
}
