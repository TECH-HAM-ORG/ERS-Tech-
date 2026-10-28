/**
 * Sitewide Organization + WebSite JSON-LD schemas.
 *
 * TODO – business facts to fill in once you have them:
 *   - organization.url            : confirmed canonical home URL (currently https://erstech.org)
 *   - organization.logo           : absolute URL to a 112×112px+ logo image in /public
 *   - organization.email          : official contact email
 *   - organization.telephone      : e.g. "+92-XXX-XXXXXXX"
 *   - organization.address        : streetAddress, addressLocality, addressCountry
 *   - organization.sameAs         : array of social profile URLs
 *                                   (LinkedIn, GitHub, Twitter/X, Facebook, etc.)
 *   - website.potentialAction     : SearchAction target URL if site search is ever added
 */

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://erstech.org/#organization",
  name: "ERS TECH",
  url: "https://erstech.org",
  // logo: { "@type": "ImageObject", url: "https://erstech.org/assets/icons/og.png" }, // TODO: confirm logo URL
  // email: "TODO",
  // telephone: "TODO",
  // address: { "@type": "PostalAddress", streetAddress: "TODO", addressLocality: "TODO", addressCountry: "PK" },
  // sameAs: [ /* TODO: social URLs */ ],
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://erstech.org/#website",
  url: "https://erstech.org",
  name: "ERS TECH",
  publisher: { "@id": "https://erstech.org/#organization" },
};

