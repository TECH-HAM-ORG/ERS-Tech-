const EXTERNAL_DATA_URL =
  "https://blogs.erstech.org/wp-json/custom/v1/posts/?page=1&per_page=1000";

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

     <url>
       <loc>https://erstech.org/</loc>
        <lastmod>2024-12-16T10:22:01.199Z</lastmod>
        <changefreq>never</changefreq>
        <priority>1</priority>
     </url>
      <url>
       <loc>https://erstech.org/about-us</loc>
        <lastmod>2024-12-16T10:22:01.199Z</lastmod>
        <changefreq>never</changefreq>
        <priority>1</priority>
     </url>
      <url>
       <loc>https://erstech.org/careers</loc>
        <lastmod>2024-12-16T10:22:01.199Z</lastmod>
        <changefreq>never</changefreq>
        <priority>1</priority>
     </url>
      <url>
       <loc>https://erstech.org/portfolio</loc>
        <lastmod>2024-12-16T10:22:01.199Z</lastmod>
        <changefreq>never</changefreq>
        <priority>1</priority>
     </url>
      <url>
       <loc>https://erstech.org/services</loc>
        <lastmod>2024-12-16T10:22:01.199Z</lastmod>
        <changefreq>never</changefreq>
        <priority>1</priority>
     </url>
       <url>
       <loc>https://erstech.org/pricing</loc>
        <lastmod>2024-12-16T10:22:01.199Z</lastmod>
        <changefreq>never</changefreq>
        <priority>1</priority>
     </url>
       <url>
       <loc>https://erstech.org/blogs</loc>
        <lastmod>2024-12-16T10:22:01.199Z</lastmod>
        <changefreq>never</changefreq>
        <priority>1</priority>
     </url>
     ${posts
       .map(({ slug }) => {
         return `
       <url>
           <loc>${`https://erstech.org/blogs/${slug}`}</loc>
             <lastmod>${new Date().toISOString()}</lastmod>
            <changefreq>daily</changefreq>
            <priority>1</priority>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {}

export async function getServerSideProps({ res }) {
  const request = await fetch(EXTERNAL_DATA_URL);
  const posts = await request.json();
  const sitemap = generateSiteMap(posts);

  res.setHeader("Content-Type", "text/xml");
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
