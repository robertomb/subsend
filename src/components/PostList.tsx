import Link from "next/link";
import { postPath, type Post } from "@/lib/posts";
import { formatDate, isoDate } from "@/lib/format";

export function PostList({ posts, descriptions = false }: { posts: Post[]; descriptions?: boolean }) {
  return (
    <ul className="post-list">
      {posts.map((post) => (
        <li key={post.slug}>
          <Link href={postPath(post.slug)}>{post.title}</Link>
          <time dateTime={isoDate(post.date)}>{formatDate(post.date, { short: true })}</time>
          {descriptions && <p>{post.description}</p>}
        </li>
      ))}
    </ul>
  );
}
