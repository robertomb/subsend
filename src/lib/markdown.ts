import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypeSlug from "rehype-slug";
import rehypeShiki from "@shikijs/rehype";
import rehypeStringify from "rehype-stringify";
import type { Root, Element } from "hast";
import { visit } from "unist-util-visit";
import { site } from "./site";

// Lazy-load images and keep external links safe. Runs at build time, so the
// page ships plain HTML with zero client-side JavaScript.
function rehypeHtmlDefaults() {
  return (tree: Root) => {
    visit(tree, "element", (node: Element) => {
      if (node.tagName === "img") {
        node.properties.loading = "lazy";
        node.properties.decoding = "async";
      }
      if (node.tagName === "a") {
        const href = String(node.properties.href ?? "");
        if (/^https?:\/\//.test(href) && !href.startsWith(site.url)) {
          node.properties.rel = ["noopener"];
        }
      }
    });
  };
}

const processor = unified()
  .use(remarkParse)
  .use(remarkGfm)
  .use(remarkRehype)
  .use(rehypeSlug)
  .use(rehypeShiki, {
    themes: { light: "github-light", dark: "github-dark" },
    defaultColor: "light",
  })
  .use(rehypeHtmlDefaults)
  .use(rehypeStringify);

export async function markdownToHtml(markdown: string) {
  return String(await processor.process(markdown));
}
