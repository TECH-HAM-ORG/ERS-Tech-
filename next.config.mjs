/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "erstech-lime.vercel.app", "blogs.erstech.org"],
  },
  async redirects() {
    return [
      {
        source: "/home",
        destination: "/",
        statusCode: 301,
      },
      // Fix the typo: /sitmap.xml -> /sitemap.xml (301 Permanent Redirect)
      {
        source: "/sitmap.xml",
        destination: "/sitemap.xml",
        statusCode: 301,
      },
    ];
  },
  async rewrites() {
    return [
      // Serve /sitemap.xml via the API route (no header/footer wrapper)
      {
        source: "/sitemap.xml",
        destination: "/api/sitemap",
      },
      // Serve /rss.xml via the API route
      {
        source: "/rss.xml",
        destination: "/api/rss.xml",
      },
    ];
  },
};

export default nextConfig;
