import { fetchAllPosts } from "@/utils/fetchWordPress";

const SITE_URL = "https://erstech.org";

// In-memory cache for RSS XML (10 minutes TTL)
let cachedRssXml = null;
let lastRssFetchTime = 0;
const RSS_CACHE_TTL_MS = 10 * 60 * 1000;
let lastGoodRssXml = null;

function cdata(str) {
  if (!str) return "";
  // Ensure string is clean and prevent CDATA breakout
  const text = String(str).replace(/]]>/g, "]]]]><![CDATA[>");
  return `<![CDATA[${text}]]>`;
}

function buildRssXml(posts) {
  const items = (posts || [])
    .map((post) => {
      const postUrl = `${SITE_URL}/blogs/${post.slug}`;
      let pubDate = "";
      try {
        if (post.date) {
          pubDate = new Date(post.date.replace(" ", "T") + "Z").toUTCString();
        }
      } catch {
        pubDate = "";
      }

      // Short excerpt (under 300 characters), not full post body
      const shortDesc = (post.meta_description || post.title || "")
        .replace(/<[^>]*>/g, "") // strip any stray HTML tags
        .trim()
        .slice(0, 300);

      return `    <item>
      <title>${cdata(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
      <description>${cdata(shortDesc)}</description>
    </item>`;
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>ERS TECH - Technology &amp; Innovation Blog</title>
    <link>${SITE_URL}/blogs</link>
    <description>Latest insights and articles on software engineering, blockchain, fintech, and digital innovation from ERS TECH.</description>
    <language>en-US</language>
    <atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;
}

export default async function handler(req, res) {
  res.setHeader("Content-Type", "application/rss+xml; charset=utf-8");
  res.setHeader("Cache-Control", "s-maxage=3600, stale-while-revalidate=86400");

  const now = Date.now();
  if (cachedRssXml && now - lastRssFetchTime < RSS_CACHE_TTL_MS) {
    return res.status(200).send(cachedRssXml);
  }

  try {
    const posts = await fetchAllPosts(4000);
    if (Array.isArray(posts) && posts.length > 0) {
      const xml = buildRssXml(posts);
      cachedRssXml = xml;
      lastGoodRssXml = xml;
      lastRssFetchTime = now;
      return res.status(200).send(xml);
    }
  } catch (err) {
    console.error("RSS generation error:", err.message);
  }

  if (lastGoodRssXml) {
    return res.status(200).send(lastGoodRssXml);
  }

  const fallbackXml = buildRssXml([]);
  return res.status(200).send(fallbackXml);
}

