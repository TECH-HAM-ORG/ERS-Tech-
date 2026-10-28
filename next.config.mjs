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
    ];
  },
};

export default nextConfig;
