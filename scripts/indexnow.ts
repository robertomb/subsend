/**
 * Tell Bing, Yandex, Seznam, Naver etc. (IndexNow) that URLs changed.
 * Bing's index also powers ChatGPT search and Copilot, so new posts show up there faster.
 *
 *   pnpm indexnow                 Submit every URL in the live sitemap.
 *   pnpm indexnow /posts/foo      Submit specific paths.
 */
import { absoluteUrl } from "../src/lib/site";

async function main() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) throw new Error("INDEXNOW_KEY is not set.");

  let urls = process.argv.slice(2).map((p) => absoluteUrl(p));
  if (urls.length === 0) {
    const xml = await (await fetch(absoluteUrl("/sitemap.xml"))).text();
    urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  }

  const res = await fetch("https://api.indexnow.org/indexnow", {
    method: "POST",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify({
      host: new URL(absoluteUrl("/")).host,
      key,
      keyLocation: absoluteUrl("/indexnow-key.txt"),
      urlList: urls,
    }),
  });
  console.log(`IndexNow ${res.status} for ${urls.length} URL(s)`);
  if (!res.ok && res.status !== 202) process.exit(1);
}

main();
