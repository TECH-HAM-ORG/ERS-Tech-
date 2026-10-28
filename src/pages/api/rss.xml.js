import { fetchAllPosts } from "@/utils/fetchWordPress";

const SITE_URL = "https://erstech.org";

// In-memory cache for RSS XML (10 minutes TTL)
let cachedRssXml = null;
let lastRssFetchTime = 0;
const RSS_CACHE_TTL_MS = 10 * 60 * 1000;
let lastGoodRssXml = null;

function escapeXml(unsafe) {
  if (!unsafe) return "";
  return unsafe
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
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

      return `    <item>
      <title>${escapeXml(post.title)}</title>
      <link>${postUrl}</link>
      <guid isPermaLink="true">${postUrl}</guid>
      ${pubDate ? `<pubDate>${pubDate}</pubDate>` : ""}
      <description>${escapeXml(post.meta_description || post.title)}</description>
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

