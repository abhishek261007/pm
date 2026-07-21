import { Helmet } from 'react-helmet-async';
import { SITE_URL, SITE_NAME, DEFAULT_IMAGE } from './seoConstants';

export function createCatalogSchema(catalog, designs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${catalog.name} — PM Jewellers`,
    "description": `Browse ${designs.length} designs in the ${catalog.name} collection from PM Jewellers, Ahmedabad.`,
    "numberOfItems": designs.length,
    "itemListElement": designs.slice(0, 50).map((d, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${SITE_URL}/design/${d._id}?catalog=${catalog._id}`,
      "name": d.sku || `Design ${i + 1}`,
      "image": d.imageUrl?.startsWith('http') ? d.imageUrl : d.imageUrl ? `${SITE_URL}${d.imageUrl}` : undefined,
    })),
  };
}

export function createProductSchema({ _id, name, description, images = [], sku, weight, category }) {
  const imageUrls = images
    .filter(Boolean)
    .map((img) => (img.startsWith('http') ? img : `${SITE_URL}${img}`));

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${name} — PM Jewellers`,
    "description": description || `${name} silver jewellery from PM Jewellers`,
    "sku": sku,
    "brand": { "@type": "Brand", "name": SITE_NAME },
    "category": category || "Silver Jewellery",
    ...(imageUrls.length > 0 && { "image": imageUrls }),
    "offers": {
      "@type": "Offer",
      "url": `${SITE_URL}/design/${_id}`,
      "availability": "https://schema.org/InStock",
      "seller": { "@type": "Organization", "name": SITE_NAME },
    },
    ...(weight && { "weight": { "@type": "QuantitativeValue", "value": weight, "unitCode": "GRM" } }),
  };
}

/**
 * SEO Component - Manages all document head elements
 *
 * @param {Object} props
 * @param {string} props.title - Page title (will be appended with site name)
 * @param {string} props.description - Meta description
 * @param {string} props.keywords - Meta keywords
 * @param {string} props.image - OG/Twitter image URL
 * @param {string} props.url - Canonical URL (relative or absolute)
 * @param {string} props.type - OG type (website, product, article, etc.)
 * @param {Object} props.jsonLd - Structured data object
 * @param {Object} props.breadcrumbs - Breadcrumb items array for BreadcrumbList schema
 * @param {boolean} props.noindex - Whether to prevent indexing
 * @param {string} props.canonical - Override canonical URL
 * @param {Array} props.preloads - Array of preload links [{ href, as, type, crossorigin }]
 */
export default function SEO({
  title,
  description = 'PM Jewellers is a trusted wholesaler of pure silver ornaments, antique jewellery, and 100+ design catalogues. Supplying retailers across India since 2005 from Manekchowk, Ahmedabad.',
  keywords = 'silver jewellery wholesale, silver ornaments, antique jewellery, wholesale silver, PM Jewellers, Manekchowk, Ahmedabad',
  image = DEFAULT_IMAGE,
  url,
  type = 'website',
  jsonLd,
  breadcrumbs,
  noindex = false,
  canonical,
  preloads = [],
}) {
  // Build full title
  const fullTitle = title 
    ? `${title} | ${SITE_NAME}`
    : `${SITE_NAME} — Wholesale Silver & Antique Jewellery | Manekchowk, Ahmedabad`;

  // Build canonical URL
  const canonicalUrl = canonical || (url 
    ? (url.startsWith('http') ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`)
    : SITE_URL);

  // Build OG image URL
  const ogImage = image?.startsWith('http') ? image : `${SITE_URL}${image.startsWith('/') ? '' : '/'}${image}`;

  // Build JSON-LD array
  const jsonLdArray = [];
  
  // Add breadcrumbs schema if provided
  if (breadcrumbs && breadcrumbs.length > 0) {
    jsonLdArray.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbs.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url?.startsWith('http') ? item.url : `${SITE_URL}${item.url || ''}`
      }))
    });
  }

  // Add custom JSON-LD if provided
  if (jsonLd) {
    jsonLdArray.push(jsonLd);
  }

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={canonicalUrl} />

      {/* Robots */}
      {noindex && <meta name="robots" content="noindex, nofollow" />}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:locale" content="en_IN" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />

      {/* JSON-LD Structured Data */}
      {jsonLdArray.map((schema, index) => (
        <script key={index} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}

      {/* Performance Preload Links */}
      {preloads.map((preload, index) => (
        <link
          key={index}
          rel={preload.rel || 'preload'}
          href={preload.href}
          as={preload.as}
          type={preload.type}
          fetchpriority={preload.fetchpriority || 'auto'}
          crossorigin={preload.crossorigin}
        />
      ))}
</Helmet>
  );
}
