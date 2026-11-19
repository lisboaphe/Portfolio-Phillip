import type { Metadata } from "next";
import { PostThoughts } from "@/components/thoughts/PostThoughts";

// Private page for posting thoughts, installable as a small app ("Thoughts").
// Not linked anywhere and not indexed; it's left out of robots.txt on purpose
// so the path isn't advertised.
export const metadata: Metadata = {
  title: "Thoughts",
  robots: { index: false, follow: false },
  manifest: "/post.webmanifest",
  appleWebApp: { capable: true, title: "Thoughts", statusBarStyle: "black-translucent" },
};

export default function PostPage() {
  return <PostThoughts />;
}
