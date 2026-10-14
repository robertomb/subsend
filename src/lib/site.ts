// Derived helpers. Settings live in site.config.ts at the repo root.
import { site } from "../../site.config";

export { site };

/** The site's host, e.g. "example.com". */
export const host = new URL(site.url).host;

export const sameAs = Object.values(site.author.social).filter(Boolean);

export function absoluteUrl(path = "/") {
  return new URL(path, site.url).toString();
}
