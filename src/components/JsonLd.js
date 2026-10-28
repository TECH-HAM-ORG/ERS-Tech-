/**
 * JsonLd - reusable JSON-LD structured data injector.
 * Escapes the < character in the JSON string to \u003c
 * to prevent XSS / HTML parsing issues.
 */
function JsonLd({ data }) {
  if (!data) return null;
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}

export default JsonLd;

