/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ["localhost", "erstech-lime.vercel.app", "blogs.erstech.org"],
  },
  // async headers() {
  //   return [
  //     {
  //       source: "/sitmap.xml",
  //       headers: [
  //         {
  //           key: "Content-Type",
  //           value: "application/xml",
  //         },
  //       ],
  //     },
  //   ];
  // },
};

export default nextConfig;
