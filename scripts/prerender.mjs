/**
 * prerender.mjs
 * ─────────────
 * Generates static HTML for ALL pages from API data — no Chrome needed.
 * React hydrates on top of the pre-rendered HTML in the browser.
 *
 * Usage: node scripts/prerender.mjs
 * Must run AFTER `vite build` (expects dist/ to exist).
 */

import fs from 'fs';
import path from 'path';

const API = 'https://apis.27012610.xyz';
const SITE = 'https://pmjewellers.com';
const DIST = path.resolve('dist');
const SITE_NAME = 'PM Jewellers';

function today() {
  return new Date().toISOString().split('T')[0];
}

function esc(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function imageUrl(url) {
  if (!url) return `${SITE}/logo.png`;
  return url.startsWith('http') ? url : `${API}${url}`;
}

// ── Category content map ──
const CATEGORY_CONTENT = {
  juda: { type: 'Hair Accessory', features: ['Antique silver finish', 'Handcrafted', 'Bridal and festive design', 'Oxidized detailing', 'Premium quality'], description: 'Handcrafted silver juda designed for bridal, festive, and traditional occasions. Intricate silver work with oxidized finish, suitable for weddings, Navratri, and cultural events.', usage: 'Weddings, festive celebrations, traditional ceremonies, cultural events.', care: 'Store in dry place. Avoid perfumes and chemicals. Clean with soft cloth.' },
  payal: { type: 'Anklet', features: ['Traditional silver payal', 'Handcrafted', 'Comfortable fit', 'Oxidized finish', 'Wholesale available'], description: 'Silver payal handcrafted with traditional motifs and oxidized finish. Designed for daily wear and special occasions.', usage: 'Daily wear, festivals, weddings, traditional ceremonies.', care: 'Avoid water and moisture. Store separately. Clean with dry soft cloth.' },
  kamarband: { type: 'Waist Chain', features: ['Silver kamarband', 'Traditional design', 'Adjustable fit', 'Handcrafted', 'Bridal accessory'], description: 'Silver kamarband designed with traditional Indian motifs. Classic bridal accessory for lehengas and sarees.', usage: 'Weddings, bridal attire, traditional ceremonies, festive occasions.', care: 'Handle with care. Store in jewelry box. Avoid water and chemicals.' },
  purse: { type: 'Clutch', features: ['Silver purse', 'Antique design', 'Handcrafted', 'Party wear', 'Ethnic accessory'], description: 'Silver purse with antique silver work and intricate detailing. Premium accessory for parties, weddings, and festive occasions.', usage: 'Parties, weddings, festive events, special occasions.', care: 'Store in dry place. Avoid moisture. Clean with soft dry cloth.' },
  bangles: { type: 'Bangle', features: ['Silver bangles', 'Handcrafted', 'Traditional design', 'Oxidized finish', 'Wholesale available'], description: 'Silver bangles handcrafted with traditional patterns and oxidized finish. Suitable for daily wear and special occasions.', usage: 'Daily wear, festivals, weddings, traditional events.', care: 'Avoid dropping. Store in bangle stand or soft cloth. Clean with dry cloth.' },
  necklace: { type: 'Necklace', features: ['Silver necklace', 'Traditional design', 'Handcrafted', 'Oxidized finish', 'Premium quality'], description: 'Silver necklace crafted with intricate traditional motifs and oxidized finish. Statement piece for weddings and festivals.', usage: 'Weddings, festive occasions, traditional ceremonies, special events.', care: 'Store in jewelry box. Avoid perfumes and chemicals. Clean gently.' },
  earrings: { type: 'Earrings', features: ['Silver earrings', 'Handcrafted', 'Traditional design', 'Comfortable wear', 'Oxidized finish'], description: 'Silver earrings with traditional designs and oxidized finish. Handcrafted for comfort and style.', usage: 'Daily wear, festivals, weddings, special occasions.', care: 'Store in earring holder. Avoid water and chemicals.' },
  rings: { type: 'Ring', features: ['Silver ring', 'Adjustable', 'Handcrafted', 'Traditional design', 'Premium quality'], description: 'Silver ring handcrafted with traditional motifs and oxidized finish. Adjustable design for comfortable fit.', usage: 'Daily wear, festivals, weddings, casual outings.', care: 'Avoid water and chemicals. Store separately. Clean with soft cloth.' },
};

function getCatalogContent(catalogName) {
  const name = (catalogName || '').toLowerCase();
  for (const [key, content] of Object.entries(CATEGORY_CONTENT)) {
    if (name.includes(key)) return content;
  }
  return {
    type: 'Silver Jewellery',
    features: ['Handcrafted silver', 'Premium quality', 'Oxidized finish', 'Traditional design', 'Wholesale available'],
    description: `Handcrafted silver jewellery from PM Jewellers featuring traditional Indian design with oxidized finish. Made with pure silver for weddings, festivals, and everyday elegance.`,
    usage: 'Weddings, festivals, traditional events, daily wear.',
    care: 'Store in dry place. Avoid perfumes and chemicals. Clean with soft cloth.',
  };
}

function productSchema(design, catalogName) {
  const imgUrl = imageUrl(design.imageUrl);
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Product",
    "name": `${catalogName} — ${design.sku} — ${SITE_NAME}`,
    "description": `${catalogName} silver jewellery design (${design.sku}, ${design.weight}g). Wholesale silver jewellery from ${SITE_NAME}, Ahmedabad.`,
    "sku": design.sku,
    "brand": { "@type": "Brand", "name": SITE_NAME },
    "category": catalogName || 'Silver Jewellery',
    "material": "Silver",
    "itemCondition": "https://schema.org/NewCondition",
    "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "150", "bestRating": "5" },
    "image": [imgUrl],
    "offers": {
      "@type": "Offer",
      "url": `${SITE}/design/${design._id}`,
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "JewelryStore",
        "name": SITE_NAME,
        "address": { "@type": "PostalAddress", "streetAddress": "Chandidham Complex, 1204/F2, MGH Road, Old City, Manekchowk", "addressLocality": "Ahmedabad", "addressRegion": "Gujarat", "postalCode": "380001", "addressCountry": "IN" }
      }
    },
    "weight": { "@type": "QuantitativeValue", "value": design.weight, "unitCode": "GRM" }
  });
}

function catalogSchema(catalog, designs) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${catalog.name} — ${SITE_NAME}`,
    "description": `Browse ${designs.length} designs in the ${catalog.name} collection from ${SITE_NAME}, Ahmedabad.`,
    "numberOfItems": designs.length,
    "itemListElement": designs.slice(0, 50).map((d, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "url": `${SITE}/design/${d._id}`,
      "name": d.sku || `Design ${i + 1}`,
      "image": imageUrl(d.thumbnailUrl || d.imageUrl),
    })),
  });
}

function breadcrumbSchema(items) {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, i) => ({
      "@type": "ListItem",
      "position": i + 1,
      "name": item.name,
      "item": item.url.startsWith('http') ? item.url : `${SITE}${item.url}`
    }))
  });
}

// ── Generate HTML for a design page ──
function designHtml(baseHead, design, catalogName) {
  const title = `${catalogName} — ${design.sku} | ${SITE_NAME}`;
  const desc = `Handcrafted ${catalogName} silver jewellery design (${design.sku}, ${design.weight}g). Premium wholesale silver from ${SITE_NAME}, Ahmedabad. Buy silver jewellery online.`;
  const keywords = `${catalogName}, ${design.sku}, silver jewellery, ${design.weight}g, ${SITE_NAME}, Ahmedabad, Gujarat, wholesale silver, antique silver, bridal silver`;
  const imgUrl = imageUrl(design.imageUrl);
  const canonical = `${SITE}/design/${design._id}`;
  const cat = getCatalogContent(catalogName);

  const head = `<title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <meta name="keywords" content="${esc(keywords)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="product">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${imgUrl}">
    <meta property="og:image:width" content="1200">
    <meta property="og:image:height" content="630">
    <meta property="og:image:alt" content="${esc(catalogName)} ${design.sku} silver jewellery">
    <meta property="og:url" content="${canonical}">
    <meta property="og:locale" content="en_IN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(desc)}">
    <meta name="twitter:image" content="${imgUrl}">
    <script type="application/ld+json">${breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Catalogues', url: '/listing' },
      { name: catalogName, url: `/catalog/${design.catalogId || design.catalog?._id || ''}` },
      { name: design.sku, url: `/design/${design._id}` }
    ])}</script>
    <script type="application/ld+json">${productSchema(design, catalogName)}</script>`;

  // Visible pre-rendered content (React will hydrate on top)
  const body = `<div id="root"><div style="min-height:100vh;background:#F7F6F3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2C1810">
    <div style="background:linear-gradient(135deg,#8B1A4A,#1B3A5C,#4A8B7C);padding:24px 20px;border-bottom-left-radius:28px;border-bottom-right-radius:28px">
      <h1 style="font-size:28px;font-weight:200;color:#FFF;letter-spacing:-0.5px;margin:0">${esc(catalogName)}</h1>
    </div>
    <div style="padding:16px;max-width:600px;margin:0 auto">
      <img src="${imgUrl}" alt="Premium ${esc(catalogName)} silver ${design.sku} ${design.weight}g design" style="width:100%;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.25);margin-bottom:16px" width="600" height="600" fetchpriority="high">
      <div style="background:#FFFBF4;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.25);padding:16px;margin-bottom:16px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <div style="background:#F5F0EB;border-radius:10px;padding:10px"><p style="font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#8A7A6B;margin:0 0 4px">Tag</p><p style="font-size:1.2rem;font-weight:200;margin:0">${esc(design.sku)}</p></div>
          <div style="background:#F5F0EB;border-radius:10px;padding:10px"><p style="font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#8A7A6B;margin:0 0 4px">Weight</p><p style="font-size:1.2rem;font-weight:200;margin:0">${design.weight}g</p></div>
        </div>
      </div>
      <div style="background:#FFFBF4;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.25);padding:16px;margin-bottom:16px">
        <h2 style="font-size:18px;font-weight:400;margin:0 0 12px">${esc(catalogName)} — Silver ${cat.type}</h2>
        <p style="font-size:13px;font-weight:300;color:#4A4A4A;line-height:1.6;margin:0 0 16px">${esc(cat.description)}</p>
        <p style="font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#8A7A6B;margin:0 0 8px">Features</p>
        <ul style="list-style:none;padding:0;margin:0 0 16px">${cat.features.map(f => `<li style="font-size:12px;font-weight:400;padding:6px 0;border-bottom:1px solid #F0E8E0">◆ ${esc(f)}</li>`).join('')}</ul>
        <p style="font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#8A7A6B;margin:0 0 8px">Specifications</p>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:16px">
          <div style="background:#F5F0EB;border-radius:10px;padding:10px"><p style="font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#8A7A6B;margin:0 0 4px">Material</p><p style="font-size:1.2rem;font-weight:200;margin:0">Pure Silver</p></div>
          <div style="background:#F5F0EB;border-radius:10px;padding:10px"><p style="font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#8A7A6B;margin:0 0 4px">Type</p><p style="font-size:1.2rem;font-weight:200;margin:0">${esc(cat.type)}</p></div>
        </div>
        <p style="font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#8A7A6B;margin:0 0 8px">Usage</p>
        <p style="font-size:12px;font-weight:300;color:#6A6A6A;line-height:1.5;margin:0 0 16px">${esc(cat.usage)}</p>
        <p style="font-size:11px;font-weight:600;letter-spacing:1.5px;text-transform:uppercase;color:#8A7A6B;margin:0 0 8px">Care Instructions</p>
        <p style="font-size:12px;font-weight:300;color:#6A6A6A;line-height:1.5;margin:0">${esc(cat.care)}</p>
      </div>
    </div>
  </div></div>`;

  return baseHead.replace(/<head>/, `<head>\n    ${head}`).replace(/<div id="root"><\/div>/, body);
}

// ── Generate HTML for a catalog page ──
function catalogHtml(baseHead, catalog, designs) {
  const title = `${catalog.name} — Silver Jewellery Collection | ${SITE_NAME}`;
  const desc = `Explore ${designs.length}+ premium silver jewellery designs in the ${catalog.name} collection. Wholesale silver ornaments from ${SITE_NAME}, Ahmedabad.`;
  const keywords = `${catalog.name}, silver jewellery, wholesale silver, ${SITE_NAME}, Ahmedabad, Gujarat, buy silver jewellery online, antique silver`;
  const canonical = `${SITE}/catalog/${catalog._id}`;

  const head = `<title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <meta name="keywords" content="${esc(keywords)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${SITE}/logo.png">
    <meta property="og:url" content="${canonical}">
    <meta property="og:locale" content="en_IN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(desc)}">
    <script type="application/ld+json">${breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Catalogues', url: '/listing' },
      { name: catalog.name, url: `/catalog/${catalog._id}` }
    ])}</script>
    <script type="application/ld+json">${catalogSchema(catalog, designs)}</script>`;

  // Pre-rendered catalog grid
  const cards = designs.slice(0, 50).map(d => {
    const img = imageUrl(d.thumbnailUrl || d.imageUrl);
    return `<a href="/design/${d._id}" style="text-decoration:none;display:block;background:#FFFBF4;border-radius:4px;box-shadow:0 2px 5px rgba(0,0,0,0.25);padding:6px">
      <img src="${img}" alt="Silver ${esc(catalog.name)} ${esc(d.sku)} ${d.weight}g" style="width:100%;aspect-ratio:1;object-fit:contain;border-radius:4px" loading="lazy" width="400" height="400">
      <div style="padding:4px;display:flex;gap:6px">
        <div style="flex:1;background:#F5F0EB;border-radius:8px;padding:6px 8px"><span style="font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#8A7A6B">SKU</span><br><span style="font-size:11px;font-weight:500;color:#2C1810">${esc(d.sku)}</span></div>
        <div style="flex:1;background:#F5F0EB;border-radius:8px;padding:6px 8px"><span style="font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#8A7A6B">Wt</span><br><span style="font-size:11px;font-weight:500;color:#2C1810">${d.weight}g</span></div>
      </div>
    </a>`;
  }).join('\n          ');

  const body = `<div id="root"><div style="min-height:100vh;background:#F7F6F3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2C1810">
    <div style="background:linear-gradient(135deg,#8B1A4A,#1B3A5C,#4A8B7C);padding:24px 20px;border-bottom-left-radius:28px;border-bottom-right-radius:28px">
      <p style="font-size:10px;font-weight:600;letter-spacing:3px;color:rgba(255,255,255,0.85);margin:0 0 2px">Collection</p>
      <h1 style="font-size:28px;font-weight:200;color:#FFF;letter-spacing:-0.5px;margin:0">${esc(catalog.name)}</h1>
    </div>
    <div style="padding:16px">
      <p style="font-size:11px;font-weight:600;letter-spacing:2px;color:#8A7A6B;margin:0 0 14px">DESIGNS <span style="font-weight:600;color:#8B1A4A">${designs.length}</span></p>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:1px">
          ${cards}
      </div>
    </div>
  </div></div>`;

  return baseHead.replace(/<head>/, `<head>\n    ${head}`).replace(/<div id="root"><\/div>/, body);
}

// ── Generate HTML for the Home page ──
function homeHtml(baseHead, catalogs) {
  const title = `${SITE_NAME} — Wholesale Silver Jewellery | Juda, Payal, Bangles, Rings, Earrings`;
  const desc = `${SITE_NAME} is Ahmedabad's trusted wholesale silver jewellery supplier since 2005. Shop silver juda, payal, kamarband, purse, bangles, necklace, earrings, rings. 100+ designs. Buy pure silver online.`;
  const keywords = 'silver jewellery, silver juda, silver payal, silver kamarband, silver purse, silver bangles, silver necklace, silver earrings, silver rings, wholesale silver jewellery, antique silver, PM Jewellers, Ahmedabad';

  const catCards = catalogs.slice(0, 12).map(c => {
    const img = imageUrl(c.heroImageUrl);
    return `<a href="/catalog/${c._id}" style="text-decoration:none;display:block;background:#FFFBF4;border-radius:4px;box-shadow:0 2px 5px rgba(0,0,0,0.25);padding:6px">
      <img src="${img}" alt="Silver ${esc(c.name)} collection, PM Jewellers" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:4px" loading="lazy" width="400" height="400">
      <div style="padding:6px 4px;text-align:center"><span style="font-size:12px;font-weight:500;color:#2C1810">${esc(c.name)}</span></div>
    </a>`;
  }).join('\n          ');

  const head = `<title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <meta name="keywords" content="${esc(keywords)}">
    <link rel="canonical" href="${SITE}/">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${SITE}/logo.png">
    <meta property="og:url" content="${SITE}/">
    <meta property="og:locale" content="en_IN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(desc)}">
    <script type="application/ld+json">${JSON.stringify({
      "@context": "https://schema.org",
      "@type": "JewelryStore",
      "name": SITE_NAME,
      "description": desc,
      "url": SITE,
      "logo": `${SITE}/logo.png`,
      "address": { "@type": "PostalAddress", "streetAddress": "Chandidham Complex, 1204/F2, MGH Road, Old City, Manekchowk", "addressLocality": "Ahmedabad", "addressRegion": "Gujarat", "postalCode": "380001", "addressCountry": "IN" },
      "areaServed": { "@type": "City", "name": "Ahmedabad" },
      "aggregateRating": { "@type": "AggregateRating", "ratingValue": "4.8", "reviewCount": "150", "bestRating": "5" }
    })}</script>`;

  const body = `<div id="root"><div style="min-height:100vh;background:#F7F6F3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2C1810">
    <div style="background:linear-gradient(135deg,#8B1A4A,#1B3A5C,#4A8B7C);padding:40px 20px 32px;border-bottom-left-radius:28px;border-bottom-right-radius:28px;text-align:center">
      <p style="font-size:10px;font-weight:600;letter-spacing:3px;color:rgba(255,255,255,0.75);margin:0 0 4px">Since 2005</p>
      <h1 style="font-size:32px;font-weight:200;color:#FFF;letter-spacing:-0.5px;margin:0 0 8px">${esc(SITE_NAME)}</h1>
      <p style="font-size:13px;font-weight:300;color:rgba(255,255,255,0.85);line-height:1.5;margin:0">Wholesale Silver Jewellery — Ahmedabad, Gujarat</p>
    </div>
    <div style="padding:20px 16px">
      <p style="font-size:11px;font-weight:600;letter-spacing:2px;color:#8A7A6B;margin:0 0 14px">CATALOGUES</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px">
          ${catCards}
      </div>
      <div style="margin-top:24px;background:#FFFBF4;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.25);padding:16px">
        <h2 style="font-size:16px;font-weight:400;margin:0 0 8px">Silver Jewellery Collections</h2>
        <p style="font-size:12px;font-weight:300;color:#4A4A4A;line-height:1.6;margin:0 0 8px">Explore handcrafted silver juda, payal, kamarband, purse, bangles, necklace, earrings, and rings from PM Jewellers. Pure silver with traditional Indian craftsmanship, available for wholesale.</p>
        <p style="font-size:12px;font-weight:300;color:#4A4A4A;line-height:1.6;margin:0">Trusted by 500+ retailers across Gujarat. Visit us at Manekchowk, Ahmedabad or shop online.</p>
      </div>
    </div>
  </div></div>`;

  return baseHead.replace(/<head>/, `<head>\n    ${head}`).replace(/<div id="root"><\/div>/, body);
}

// ── Generate HTML for the Listing page ──
function listingHtml(baseHead, catalogs) {
  const title = `Silver Jewellery Collections — Juda, Payal, Bangles, Rings, Earrings | ${SITE_NAME}`;
  const desc = `Browse ${catalogs.length}+ collections of premium silver jewellery at ${SITE_NAME}. Silver juda, payal, kamarband, purse, bangles, necklace, earrings, rings. Wholesale pricing from Ahmedabad.`;
  const keywords = 'silver jewellery collections, wholesale catalogs, silver juda, silver payal, silver bangles, silver earrings, silver rings, silver necklace, silver purse, PM Jewellers, Ahmedabad';

  const cards = catalogs.map(c => {
    const img = imageUrl(c.heroImageUrl);
    return `<a href="/catalog/${c._id}" style="text-decoration:none;display:block;background:#FFFBF4;border-radius:8px;box-shadow:0 2px 5px rgba(0,0,0,0.25);padding:6px">
      <img src="${img}" alt="Silver ${esc(c.name)} collection gallery, PM Jewellers" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:4px" loading="lazy" width="400" height="400">
      <div style="padding:6px 4px"><span style="font-size:12px;font-weight:500;color:#2C1810">${esc(c.name)}</span></div>
    </a>`;
  }).join('\n          ');

  const head = `<title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}">
    <meta name="keywords" content="${esc(keywords)}">
    <link rel="canonical" href="${SITE}/listing">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(desc)}">
    <meta property="og:image" content="${SITE}/logo.png">
    <meta property="og:url" content="${SITE}/listing">
    <meta property="og:locale" content="en_IN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(desc)}">
    <script type="application/ld+json">${breadcrumbSchema([
      { name: 'Home', url: '/' },
      { name: 'Catalogues', url: '/listing' }
    ])}</script>`;

  const body = `<div id="root"><div style="min-height:100vh;background:#F7F6F3;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;color:#2C1810">
    <div style="background:linear-gradient(135deg,#8B1A4A,#1B3A5C,#4A8B7C);padding:24px 20px;border-bottom-left-radius:28px;border-bottom-right-radius:28px">
      <p style="font-size:10px;font-weight:600;letter-spacing:3px;color:rgba(255,255,255,0.85);margin:0 0 2px">Since 2005</p>
      <h1 style="font-size:28px;font-weight:200;color:#FFF;letter-spacing:-0.5px;margin:0">${esc(SITE_NAME)}</h1>
    </div>
    <div style="padding:16px">
      <p style="font-size:11px;font-weight:600;letter-spacing:2px;color:#8A7A6B;margin:0 0 14px">COLLECTIONS <span style="font-weight:600;color:#8B1A4A">${catalogs.length}</span></p>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
          ${cards}
      </div>
    </div>
  </div></div>`;

  return baseHead.replace(/<head>/, `<head>\n    ${head}`).replace(/<div id="root"><\/div>/, body);
}

async function main() {
  const t0 = Date.now();
  console.log('Pre-rendering all pages from API data...\n');

  // Read the base HTML (has CSS/JS links, fonts, etc.)
  const baseHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');
  // Extract just the <head> content up to </head>
  const baseHeadMatch = baseHtml.match(/<head>[\s\S]*?<\/head>/);
  if (!baseHeadMatch) { console.error('Could not parse index.html'); process.exit(1); }
  const baseHead = baseHeadMatch[0];

  let designCount = 0;
  let catalogCount = 0;

  // Fetch all catalogs
  let catalogs = [];
  try {
    const res = await fetch(`${API}/public/catalogs`);
    catalogs = await res.json();
    if (!Array.isArray(catalogs)) catalogs = [];
  } catch (e) {
    console.error('Failed to fetch catalogs:', e.message);
    process.exit(1);
  }
  console.log(`Found ${catalogs.length} catalogs`);

  // Write Home page
  fs.writeFileSync(path.join(DIST, 'index.html'), homeHtml(baseHead, catalogs), 'utf-8');
  console.log('  ✓ Home page');

  // Write Listing page
  const listingDir = path.join(DIST, 'listing');
  fs.mkdirSync(listingDir, { recursive: true });
  fs.writeFileSync(path.join(listingDir, 'index.html'), listingHtml(baseHead, catalogs), 'utf-8');
  console.log('  ✓ Listing page');

  // Process each catalog
  for (const cat of catalogs) {
    let designs = [];
    try {
      const res = await fetch(`${API}/public/designs?catalogId=${cat._id}`);
      designs = await res.json();
      if (!Array.isArray(designs)) designs = [];
      designs = designs.filter(d => d.status === 'available');
    } catch { /* skip */ }

    // Write catalog page
    const catDir = path.join(DIST, 'catalog', cat._id);
    fs.mkdirSync(catDir, { recursive: true });
    fs.writeFileSync(path.join(catDir, 'index.html'), catalogHtml(baseHead, cat, designs), 'utf-8');
    catalogCount++;

    // Write design pages
    for (const d of designs) {
      const designDir = path.join(DIST, 'design', d._id);
      fs.mkdirSync(designDir, { recursive: true });
      fs.writeFileSync(path.join(designDir, 'index.html'), designHtml(baseHead, d, cat.name), 'utf-8');
      designCount++;
    }

    console.log(`  ✓ ${cat.name}: ${designs.length} designs`);
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\nDone: Home + Listing + ${catalogCount} catalog + ${designCount} design pages in ${elapsed}s`);
}

main().catch(e => { console.error(e); process.exit(1); });
