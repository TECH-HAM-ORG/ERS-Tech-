import https from "https";

// In-memory module-level cache (60 seconds TTL)
// Ensures multiple calls during the same build or revalidation share a single request.
let cachedPosts = null;
let cacheTimestamp = 0;
const CACHE_TTL_MS = 60 * 1000;

// Flag to log the TLS warning only once per Node process
let tlsWarningLogged = false;

/**
 * Safely fetches posts from WordPress REST API.
 *
 * TLS Verification:
 * - Verification is ON by default (rejectUnauthorized: true).
 * - Bypassed ONLY if process.env.WP_INSECURE_TLS === '1'.
 *   (Temporary workaround until the blogs.erstech.org SSL certificate is renewed).
 *
 * Failure Handling:
 * - Returns Array<Post> on success.
 * - Returns null when WordPress is unreachable, timed out, or returns invalid data.
 *   This signals to callers (e.g. getStaticProps) that WordPress failed, so they can
 *   throw an error during ISR to keep serving the last good page instead of caching
 *   a 404 or an empty page.
 *
 * @param {number} timeoutMs
 * @returns {Promise<Array|null>}
 */
export function fetchAllPosts(timeoutMs = 4000) {
  const now = Date.now();
  if (cachedPosts !== null && now - cacheTimestamp < CACHE_TTL_MS) {
    return Promise.resolve(cachedPosts);
  }

  return new Promise((resolve) => {
    // TLS verification is ON by default; disabled ONLY when WP_INSECURE_TLS === "1"
    const isInsecureTls = process.env.WP_INSECURE_TLS === "1";

    if (isInsecureTls && !tlsWarningLogged) {
      console.warn(
        "[WP] WP_INSECURE_TLS=1 is active: TLS certificate verification disabled (temporary until blogs.erstech.org certificate is renewed)."
      );
      tlsWarningLogged = true;
    }

    // TLS verification is ON by default; disabled ONLY when WP_INSECURE_TLS === '1'
    const agent = new https.Agent({
      rejectUnauthorized: !isInsecureTls,
    });

    const url = "https://blogs.erstech.org/wp-json/custom/v1/posts/?page=1&per_page=100";

    const req = https.get(url, { agent, timeout: timeoutMs }, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const json = JSON.parse(data);
            if (Array.isArray(json)) {
              cachedPosts = json;
              cacheTimestamp = Date.now();
              resolve(json);
              return;
            }
          }
          console.error(`WordPress API responded with status ${res.statusCode}`);
          resolve(null);
        } catch {
          console.error("WordPress API JSON parse failed");
          resolve(null);
        }
      });
    });

    req.on("error", (err) => {
      console.error(`WordPress API network error: ${err.message}`);
      resolve(null);
    });

    req.on("timeout", () => {
      req.destroy();
      console.error(`WordPress API request timed out after ${timeoutMs}ms`);
      resolve(null);
    });
  });
}

/**
 * Server-side HTML sanitizer for WordPress content.
 * Preserves safe rich formatting, typography, tables, pre/code blocks, figure/figcaption,
 * images with attributes, and whitelisted video iframes (YouTube and Vimeo).
 * Strips executable scripts, dangerous tags, rogue iframes, and inline event handlers.
 *
 * @param {string} html
 * @returns {string}
 */
export function sanitizeWordPressHtml(html) {
  if (!html || typeof html !== "string") return "";

  let sanitized = html;

  // 1. Remove dangerous executable/embed elements and their contents
  sanitized = sanitized.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "");
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, "");
  sanitized = sanitized.replace(/<(object|embed|applet|form|input|textarea|button|base|meta|link)\b[^>]*>.*?<\/\1>/gi, "");
  sanitized = sanitized.replace(/<(object|embed|applet|form|input|textarea|button|base|meta|link)\b[^>]*\/?>/gi, "");

  // 2. Whitelist iframes: Only allow YouTube and Vimeo embeds; strip all other iframes
  sanitized = sanitized.replace(/<iframe\b([^>]*)>(.*?)<\/iframe>/gi, (match, attrs, body) => {
    const srcMatch = attrs.match(/\bsrc\s*=\s*(['"])(.*?)\1/i);
    if (!srcMatch) return "";
    const src = srcMatch[2].trim();
    const isWhitelisted = /^(https?:)?\/\/(www\.)?(youtube\.com|youtube-nocookie\.com|player\.vimeo\.com)\//i.test(src);
    if (!isWhitelisted) return "";
    const cleanAttrs = attrs.replace(/\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");
    return `<iframe${cleanAttrs}>${body}</iframe>`;
  });

  // 3. Strip all inline on* event handler attributes (onload, onerror, onclick, etc.)
  sanitized = sanitized.replace(/\son\w+\s*=\s*(?:'[^']*'|"[^"]*"|[^\s>]+)/gi, "");

  // 4. Neutralize javascript: or vbscript: pseudo-protocols in href and src
  sanitized = sanitized.replace(/href\s*=\s*(['"])\s*(?:javascript|vbscript):[^\1]*?\1/gi, 'href="#"');
  sanitized = sanitized.replace(/src\s*=\s*(['"])\s*(?:javascript|vbscript):[^\1]*?\1/gi, 'src=""');

  return sanitized;
}
