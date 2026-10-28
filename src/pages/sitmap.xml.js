/**
 * Legacy typo route: /sitmap.xml
 * next.config.mjs handles the 301 redirect to /sitemap.xml.
 * This file is kept empty so Next.js does not complain about a missing page.
 * The redirect in next.config.mjs takes precedence before this page is rendered.
 */
export default function SiteMapLegacy() {
  return null;
}
