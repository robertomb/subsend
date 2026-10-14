import { getPublicPost, getPublicPosts } from "@/lib/posts";
import { ogImage, ogSize } from "@/lib/og";

export const size = ogSize;
export const contentType = "image/png";
export const alt = "Post cover";

export function generateStaticParams() {
  return getPublicPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const post = getPublicPost((await params).slug);
  return ogImage({ title: post?.title ?? "", subtitle: post?.description });
}
