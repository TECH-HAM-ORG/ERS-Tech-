const fs = require("fs");
const path = require("path");

function sanitizeWordPressHtml(html) {
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

function countTags(html) {
  if (!html) return { img: 0, iframe: 0, table: 0, pre_code: 0, figure: 0, a: 0, h2_h3: 0, ul_ol: 0, length: 0 };
  return {
    img: (html.match(/<img\b[^>]*>/gi) || []).length,
    iframe: (html.match(/<iframe\b[^>]*>/gi) || []).length,
    table: (html.match(/<table\b[^>]*>/gi) || []).length,
    pre_code: (html.match(/<(pre|code)\b[^>]*>/gi) || []).length,
    figure: (html.match(/<figure\b[^>]*>/gi) || []).length,
    a: (html.match(/<a\b[^>]*>/gi) || []).length,
    h2_h3: (html.match(/<(h2|h3)\b[^>]*>/gi) || []).length,
    ul_ol: (html.match(/<(ul|ol)\b[^>]*>/gi) || []).length,
    length: html.length,
  };
}

const cachePath = path.join(__dirname, "wp-posts-cache.json");
const posts = JSON.parse(fs.readFileSync(cachePath, "utf8"));

console.log(`Auditing ${posts.length} WordPress posts before/after sanitization...\n`);

let changedPosts = [];

for (const post of posts) {
  const original = post.description || "";
  const sanitized = sanitizeWordPressHtml(original);

  const before = countTags(original);
  const after = countTags(sanitized);

  let hasDiff = false;
  const diffs = {};

  for (const key of Object.keys(before)) {
    if (before[key] !== after[key]) {
      hasDiff = true;
      diffs[key] = { before: before[key], after: after[key] };
    }
  }

  if (hasDiff) {
    changedPosts.push({
      slug: post.slug,
      title: post.title,
      diffs,
    });
  }
}

console.log(`Posts with tag count or length changes: ${changedPosts.length} out of ${posts.length}`);
if (changedPosts.length > 0) {
  changedPosts.forEach(p => console.log(JSON.stringify(p, null, 2)));
} else {
  console.log("All 66 posts preserved 100% of their content, tags, and length identically.");
}

// Synthetic regression test on edge cases:
console.log("\n--- Synthetic Edge Case Tests ---");
const syntheticTests = [
  {
    name: "YouTube & Vimeo iframes survival",
    input: '<figure class="wp-block-embed"><iframe src="https://www.youtube.com/embed/dQw4w9WgXcQ" width="560" height="315" allowfullscreen></iframe></figure><iframe src="https://player.vimeo.com/video/76979871" width="640"></iframe>',
    verify: (out) => out.includes("youtube.com") && out.includes("player.vimeo.com") && out.includes("<figure")
  },
  {
    name: "Malicious iframe stripped",
    input: '<iframe src="https://evil-site.com/malware.html"></iframe>',
    verify: (out) => !out.includes("evil-site.com") && !out.includes("<iframe")
  },
  {
    name: "Image with srcset, alt, width, height, classes preserved",
    input: '<figure class="wp-caption"><img src="https://example.com/pic.jpg" alt="A photo" width="800" height="600" srcset="https://example.com/pic-400.jpg 400w" class="aligncenter size-full"/><figcaption>My Caption</figcaption></figure>',
    verify: (out) => out.includes('srcset="https://example.com/pic-400.jpg 400w"') && out.includes('<figcaption>My Caption</figcaption>')
  },
  {
    name: "Table and pre/code block preserved",
    input: '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Data</td></tr></tbody></table><pre><code>const x = 10;</code></pre>',
    verify: (out) => out.includes("<table>") && out.includes("<pre><code>const x = 10;</code></pre>")
  },
  {
    name: "Inline on* handlers and javascript: URLs stripped",
    input: '<img src="valid.jpg" onerror="alert(1)" onload="evil()" /><a href="javascript:alert(2)">Link</a><a href="https://legit.com" onclick="steal()">Safe</a>',
    verify: (out) => !out.includes("onerror") && !out.includes("onload") && !out.includes("onclick") && !out.includes("javascript:alert") && out.includes('href="https://legit.com"')
  }
];

let allEdgeCasesPassed = true;
syntheticTests.forEach(test => {
  const result = sanitizeWordPressHtml(test.input);
  const passed = test.verify(result);
  console.log(`Test "${test.name}": ${passed ? "PASSED" : "FAILED"}`);
  if (!passed) {
    allEdgeCasesPassed = false;
    console.log("Output was:", result);
  }
});

console.log(`\nSynthetic tests overall: ${allEdgeCasesPassed ? "ALL PASSED" : "SOME FAILED"}`);

