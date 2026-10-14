import type { NextConfig } from "next";
import { site, host } from "./src/lib/site";

const nextConfig: NextConfig = {
  async rewrites() {
    return [{ source: "/posts/:slug.md", destination: "/md/:slug" }];
  },
  async redirects() {
    return [
      // One canonical host: www redirects to the bare domain in site.url.
      // (Also set it as the primary domain in your hosting provider.)
      {
        source: "/:path*",
        has: [{ type: "host", value: `www.${host}` }],
        destination: `${site.url}/:path*`,
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
