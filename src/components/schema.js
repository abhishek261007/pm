/**
 * Schema generators for structured data
 */

export function createProductSchema(product) {
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name || product.title || "Silver Jewellery Design",
    "description": product.description || "Premium silver jewellery design from PM Jewellers, Ahmedabad",
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
    "sku": product.sku,
    ...(product.weight && { "weight": {
      "@type": "QuantitativeValue",
      "value": product.weight,
      "unitCode": "g"
    }}),
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "reviewCount": "150"
    },
    "offers": {
      "@type": "Offer",
      "url": `https://pmjewellers.com/design/${product._id || product.id}`,
      "priceCurrency": "INR",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "JewelryStore",
        "name": "PM Jewellers",
        "address": {
          "@type": "PostalAddress",
          "streetAddress": "Chandidham Complex, 1204/F2, MGH Road, Old City, Manekchowk",
          "addressLocality": "Ahmedabad",
          "addressRegion": "Gujarat",
          "postalCode": "380001",
          "addressCountry": "IN"
        }
      }
    }
  };
}

export function createCatalogSchema(catalog, designs = []) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": catalog.name || catalog.title || "Silver Jewellery Catalogue",
    "description": catalog.description || "Premium silver jewellery collection from PM Jewellers, Ahmedabad",
    "numberOfItems": designs.length,
    "itemListElement": designs.slice(0, 50).map((design, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "url": `https://pmjewellers.com/design/${design._id || design.id}`,
      "name": design.sku || design.name || `Silver Design ${index + 1}`,
      "image": (design.thumbnailUrl || design.imageUrl)
        ? ((design.thumbnailUrl || design.imageUrl).startsWith('http')
            ? (design.thumbnailUrl || design.imageUrl)
            : `https://apis.27012610.xyz${design.thumbnailUrl || design.imageUrl}`)
        : undefined,
    }))
  };
}