#!/usr/bin/env node

/**
 * SEO & Production Health Checker
 * Usage: node scripts/seo-check.js [baseUrl]
 * Default baseUrl: http://localhost:3000
 */

const baseUrl = (process.argv[2] || process.env.BASE_URL || "http://localhost:3000").replace(/\/$/, "");

const keyRoutes = [
  { path: "/", expectedCanonical: "https://erstech.org/" },
  { path: "/about-us", expectedCanonical: "https://erstech.org/about-us" },
  { path: "/services", expectedCanonical: "https://erstech.org/services" },
  { path: "/portfolio", expectedCanonical: "https://erstech.org/portfolio" },
  { path: "/careers", expectedCanonical: "https://erstech.org/careers" },
  { path: "/blogs", expectedCanonical: "https://erstech.org/blogs" },
  { path: "/blogs/early-stage-cryptos-to-buy-in-2025", expectedCanonical: "https://erstech.org/blogs/early-stage-cryptos-to-buy-in-2025" }
];

let totalChecks = 0;
let passedChecks = 0;
let failedChecks = 0;

function report(route, checkName, passed, detail) {
  totalChecks++;
  if (passed) {
    passedChecks++;
    console.log(`  [PASS] ${checkName}${detail ? ` (${detail})` : ""}`);
  } else {
    failedChecks++;
    console.error(`  [FAIL] ${checkName}${detail ? `: ${detail}` : ""}`);
  }
}

async function checkRoute(route) {
  const url = `${baseUrl}${route.path}`;
  console.log(`\nChecking route: ${route.path} (${url})`);

  let res;
  try {
    res = await fetch(url, { headers: { "User-Agent": "SEOCheckBot/1.0" } });
  } catch (err) {
    report(route.path, "Fetch HTTP response", false, err.message);
    return;
  }

  report(route.path, "HTTP Status 200", res.status === 200, `Status: ${res.status}`);
  if (res.status !== 200) return;

  const html = await res.text();

  // 1. Exactly one H1
  const h1Matches = html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi) || [];
  report(
    route.path,
    "Exactly one <h1> tag",
    h1Matches.length === 1,
    `Found ${h1Matches.length} <h1> tag(s)`
  );

  // 2. Title length
  const titleMatch = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : "";
  const titleValid = title.length >= 10 && title.length <= 80;
  report(
    route.path,
    "Title length (10-80 chars)",
    titleValid,
    `Length: ${title.length} chars - "${title}"`
  );

  // 3. Meta description
  const metaDescMatch =
    html.match(/<meta\b[^>]*name=["']description["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
    html.match(/<meta\b[^>]*content=["']([^"']*)["'][^>]*name=["']description["'][^>]*>/i);
  const metaDesc = metaDescMatch ? metaDescMatch[1].trim() : "";
  report(
    route.path,
    "Meta description present",
    metaDesc.length >= 30,
    `Length: ${metaDesc.length} chars`
  );

  // 4. Canonical URL equals expected URL
  const canonicalMatch = html.match(/<link\b[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["'][^>]*>/i);
  const canonical = canonicalMatch ? canonicalMatch[1].trim() : "";
  report(
    route.path,
    `Canonical equals expected (${route.expectedCanonical})`,
    canonical === route.expectedCanonical,
    `Found: "${canonical}"`
  );

  // 5. Absolute og:image
  const ogImageMatch =
    html.match(/<meta\b[^>]*property=["']og:image["'][^>]*content=["']([^"']*)["'][^>]*>/i) ||
    html.match(/<meta\b[^>]*content=["']([^"']*)["'][^>]*property=["']og:image["'][^>]*>/i);
  const ogImage = ogImageMatch ? ogImageMatch[1].trim() : "";
  const isAbsoluteOgImage = /^https?:\/\//i.test(ogImage);
  report(
    route.path,
    "Absolute og:image",
    isAbsoluteOgImage,
    ogImage ? `Found: "${ogImage}"` : "Missing og:image"
  );

  // 6. JSON-LD parses
  const jsonLdMatches = [...html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  let jsonLdValid = jsonLdMatches.length > 0;
  let parseErrors = [];
  jsonLdMatches.forEach((m, idx) => {
    try {
      JSON.parse(m[1]);
    } catch (e) {
      jsonLdValid = false;
      parseErrors.push(`Block ${idx + 1}: ${e.message}`);
    }
  });
  report(
    route.path,
    "JSON-LD structured data parses validly",
    jsonLdValid,
    jsonLdMatches.length > 0
      ? `${jsonLdMatches.length} block(s) parsed${parseErrors.length ? `; errors: ${parseErrors.join("; ")}` : ""}`
      : "No JSON-LD found"
  );
}

async function checkRobots() {
  console.log(`\nChecking /robots.txt`);
  try {
    const res = await fetch(`${baseUrl}/robots.txt`);
    report("/robots.txt", "HTTP Status 200", res.status === 200, `Status: ${res.status}`);
    const text = await res.text();
    report("/robots.txt", "Contains User-agent rules", /User-agent:\s*\*/i.test(text));
    report("/robots.txt", "Contains Sitemap directive", /Sitemap:\s*https?:\/\//i.test(text));
  } catch (err) {
    report("/robots.txt", "Fetch robots.txt", false, err.message);
  }
}

async function checkSitemap() {
  console.log(`\nChecking /sitemap.xml`);
  try {
    const res = await fetch(`${baseUrl}/sitemap.xml`);
    report("/sitemap.xml", "HTTP Status 200", res.status === 200, `Status: ${res.status}`);
    const text = await res.text();
    report("/sitemap.xml", "Valid XML structure (<urlset>)", /<urlset\b/i.test(text));
    report("/sitemap.xml", "Contains <loc> URLs", /<loc>https?:\/\//i.test(text));
  } catch (err) {
    report("/sitemap.xml", "Fetch sitemap.xml", false, err.message);
  }
}

async function main() {
  console.log(`===============================================`);
  console.log(`  SEO & REGRESSION GUARD AUDIT`);
  console.log(`  Target: ${baseUrl}`);
  console.log(`===============================================`);

  for (const r of keyRoutes) {
    await checkRoute(r);
  }

  await checkRobots();
  await checkSitemap();

  console.log(`\n===============================================`);
  console.log(`  SUMMARY: ${passedChecks}/${totalChecks} checks passed`);
  if (failedChecks > 0) {
    console.error(`  ${failedChecks} check(s) FAILED`);
    console.log(`===============================================\n`);
    process.exit(1);
  } else {
    console.log(`  All SEO checks PASSED successfully!`);
    console.log(`===============================================\n`);
    process.exit(0);
  }
}

main().catch(err => {
  console.error("Fatal error running SEO check:", err);
  process.exit(1);
});

