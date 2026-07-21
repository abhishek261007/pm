/**
 * Schema generators for structured data
 */

export function createProductSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name || product.title || "Silver Jewellery Design",
    "description": product.description || "Premium silver jewellery design from PM Jewellers",
    "image": product.images?.map(img =>
      typeof img === 'string'
        ? (img.startsWith('http') ? img : `https://apis.27012610.xyz/uploads/${img}`)
        : (img.url || img.src)
    ).filter(Boolean) || [],
    "brand": {
      "@type": "Brand",
      "name": "PM Jewellers"
    },
    "manufacturer": {
      "@type": "Organization",
      "name": "PM Jewellers"
    },
    "category": product.category || "Silver Jewellery",
    "material": "Silver",
    ...(product.weight && { "weight": {
      "@type": "QuantitativeValue",
      "value": product.weight,
      "unitCode": "g"
    }}),
    "offers": {
      "@type": "Offer",
      "url": `https://pmjewellers.com/design/${product._id || product.id}`,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "PM Jewellers"
      }
    }
  };
}

export function createCatalogSchema(catalog, designs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": catalog.name || catalog.title || "Silver Jewellery Catalogue",
    "description": catalog.description || "Premium silver jewellery collection from PM Jewellers",
    "numberOfItems": designs.length,
    "itemListElement": designs.map((design, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://pmjewellers.com/design/${design._id || design.id}?catalog=${catalog._id || catalog.id}`
    }))
  };
}