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
  const absoluteUrl = url.startsWith('http') ? url : `${API}${url}`;
  return absoluteUrl.replace(/^https:\/\/(?:images|apis)\.27012610\.xyz(?=\/)/, 'https://images.pmjewellers.com');
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

// ── Strip the static SEO head block from the base HTML so route heads REPLACE it ──
function stripSeoHead(baseHtml) {
  return baseHtml
    .replace(/<title>[\s\S]*?<\/title>\s*/gi, '')
    .replace(/<meta\s+name="(description|keywords)"[^>]*>\s*/gi, '')
    .replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '')
    .replace(/<meta\s+property="og:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<meta\s+name="twitter:[^"]*"[^>]*>\s*/gi, '')
    .replace(/<script\s+type="application\/ld\+json">[\s\S]*?<\/script>\s*/gi, '');
}

// ── Inject an SEO head (or keep the static one) + body content ──
function injectHtml(baseHtml, headTags, bodyContent, { keepStaticHead = false } = {}) {
  const html = keepStaticHead ? baseHtml : stripSeoHead(baseHtml);
  return html
    .replace(/<head>/, headTags ? `<head>\n    ${headTags}` : '<head>')
    .replace(/<div id="root"><\/div>/, bodyContent);
}

// ── Generate HTML for a design page ──
function designHtml(baseHtml, design, catalogName) {
  const title = `${catalogName} — ${design.sku} | ${SITE_NAME}`;
  const desc = `Handcrafted ${catalogName} silver jewellery design (${design.sku}, ${design.weight}g). Premium wholesale silver from ${SITE_NAME}, Ahmedabad. Buy silver jewellery online.`;
  const keywords = `${catalogName}, ${design.sku}, silver jewellery, ${design.weight}g, ${SITE_NAME}, Ahmedabad, Gujarat, wholesale silver, antique silver, bridal silver`;
  const imgUrl = imageUrl(design.imageUrl);
  const canonical = `${SITE}/design/${design._id}`;
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

  const body = `<div id="root"><div style="min-height:100vh;background:#F6F0E2;font-family:'Outfit','Helvetica Neue',Helvetica,Arial,sans-serif;color:#1E1810">
    <div style="background:#FCF9F1;padding:24px 20px;border-bottom:1px solid #E4D6B6;border-bottom-left-radius:22px;border-bottom-right-radius:22px">
      <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:500;color:#1E1810;margin:0">${esc(catalogName)} — ${esc(design.sku)}</h1>
    </div>
    <div style="padding:16px;max-width:600px;margin:0 auto">
      <img src="${imgUrl}" alt="Premium ${esc(catalogName)} silver ${design.sku} ${design.weight}g design" style="width:100%;border-radius:18px;border:1px solid #E4D6B6;box-shadow:0 10px 30px rgba(30,24,16,0.07);margin-bottom:14px" width="600" height="600" fetchpriority="high">
      <div style="background:#FFFDF7;border:1px solid #E4D6B6;border-radius:18px;box-shadow:0 10px 30px rgba(30,24,16,0.07);padding:16px;margin-bottom:14px">
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px">
          <div style="background:rgba(185,138,47,0.07);border:1px solid rgba(185,138,47,0.18);border-radius:10px;padding:10px"><p style="font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#8C6A24;margin:0 0 4px">Tag</p><p style="font-size:1.2rem;font-weight:200;margin:0">${esc(design.sku)}</p></div>
          <div style="background:rgba(185,138,47,0.07);border:1px solid rgba(185,138,47,0.18);border-radius:10px;padding:10px"><p style="font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#8C6A24;margin:0 0 4px">Weight</p><p style="font-size:1.2rem;font-weight:200;margin:0">${design.weight}g</p></div>
        </div>
      </div>
    </div>
  </div></div>`;

  return injectHtml(baseHtml, head, body);
}

// ── Generate HTML for a catalog page ──
function catalogHtml(baseHtml, catalog, designs) {
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

  const cards = designs.slice(0, 50).map(d => {
    const img = imageUrl(d.thumbnailUrl || d.imageUrl);
    return `<a href="/design/${d._id}" style="text-decoration:none;display:block;background:#FFFDF7;border:1px solid #E4D6B6;border-radius:20px;box-shadow:0 10px 30px rgba(30,24,16,0.07);padding:12px">
      <img src="${img}" alt="Silver ${esc(catalog.name)} ${esc(d.sku)} ${d.weight}g" style="width:100%;aspect-ratio:1;object-fit:contain;border-radius:14px" loading="lazy" width="400" height="400">
      <div style="padding:10px 4px 4px;display:flex;gap:6px">
        <div style="flex:1;background:rgba(185,138,47,0.07);border:1px solid rgba(185,138,47,0.18);border-radius:8px;padding:6px 8px"><span style="font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#8C6A24">SKU</span><br><span style="font-size:11px;font-weight:500;color:#1E1810">${esc(d.sku)}</span></div>
        <div style="flex:1;background:rgba(185,138,47,0.07);border:1px solid rgba(185,138,47,0.18);border-radius:8px;padding:6px 8px"><span style="font-size:8px;font-weight:600;letter-spacing:1px;text-transform:uppercase;color:#8C6A24">Wt</span><br><span style="font-size:11px;font-weight:500;color:#1E1810">${d.weight}g</span></div>
      </div>
    </a>`;
  }).join('\n          ');

  const body = `<div id="root"><div style="min-height:100vh;background:#F6F0E2;font-family:'Outfit','Helvetica Neue',Helvetica,Arial,sans-serif;color:#1E1810">
    <div style="background:#FCF9F1;padding:24px 20px;border-bottom:1px solid #E4D6B6;border-bottom-left-radius:22px;border-bottom-right-radius:22px">
      <p style="font-size:10px;font-weight:600;letter-spacing:3px;color:#8C6A24;margin:0 0 2px">Collection</p>
      <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:500;color:#1E1810;margin:0">${esc(catalog.name)}</h1>
    </div>
    <div style="padding:16px">
      <p style="font-size:11px;font-weight:600;letter-spacing:2px;color:#8C7C64;margin:0 0 14px">DESIGNS <span style="font-weight:600;color:#8C6A24">${designs.length}</span></p>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
          ${cards}
      </div>
    </div>
  </div></div>`;

  return injectHtml(baseHtml, head, body);
}

// ── Generate HTML for the Home page ──
function homeHtml(baseHtml, catalogs) {
  const catCards = catalogs.slice(0, 12).map(c => {
    const img = imageUrl(c.heroImageUrl);
    return `<a href="/catalog/${c._id}" style="text-decoration:none;display:block;background:#FFFDF7;border:1px solid #E4D6B6;border-radius:20px;box-shadow:0 10px 30px rgba(30,24,16,0.07);padding:12px">
      <img src="${img}" alt="Silver ${esc(c.name)} collection, PM Jewellers" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:14px" loading="lazy" width="400" height="400">
      <div style="padding:10px 4px 4px;text-align:center"><span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;font-weight:500;color:#1E1810">${esc(c.name)}</span></div>
    </a>`;
  }).join('\n          ');

  // Home keeps the static <head> (single, complete set) — see T-2. Only the body is injected.
  const body = `<div id="root"><div style="min-height:100vh;background:#F6F0E2;font-family:'Outfit','Helvetica Neue',Helvetica,Arial,sans-serif;color:#1E1810">
    <div style="background:#FCF9F1;padding:48px 20px 36px;border-bottom:1px solid #E4D6B6;border-bottom-left-radius:22px;border-bottom-right-radius:22px;text-align:center">
      <p style="font-size:10px;font-weight:600;letter-spacing:3px;color:#8C6A24;margin:0 0 8px">Since 2005 · Manekchowk</p>
      <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-style:italic;font-size:34px;font-weight:500;color:#1E1810;margin:0 0 10px">Jewellery That Becomes Your Legacy</h1>
      <p style="font-size:13px;font-weight:300;color:#8C7C64;line-height:1.6;margin:0">Handcrafted heirlooms in silver, kundan and polki — made to be inherited.</p>
    </div>
    <div style="padding:20px 16px">
      <p style="font-size:11px;font-weight:600;letter-spacing:2px;color:#8C6A24;margin:0 0 14px">CURATED COLLECTIONS</p>
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:12px">
          ${catCards}
      </div>
      <div style="margin-top:24px;background:#FFFDF7;border:1px solid #E4D6B6;border-radius:18px;box-shadow:0 10px 30px rgba(30,24,16,0.07);padding:18px">
        <h2 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:20px;font-weight:500;margin:0 0 8px">Silver Jewellery Collections</h2>
        <p style="font-size:12px;font-weight:300;color:#5C5344;line-height:1.6;margin:0 0 8px">Explore handcrafted silver juda, payal, kamarband, purse, bangles, necklace, earrings, and rings from PM Jewellers. Pure silver with traditional Indian craftsmanship, available for wholesale.</p>
        <p style="font-size:12px;font-weight:300;color:#5C5344;line-height:1.6;margin:0">Trusted by 500+ retailers across Gujarat. Visit us at Manekchowk, Ahmedabad or shop online.</p>
      </div>
    </div>
  </div></div>`;

  return injectHtml(baseHtml, null, body, { keepStaticHead: true });
}

// ── Generate HTML for the Listing page ──
function listingHtml(baseHtml, catalogs) {
  const title = `Silver Jewellery Collections — Juda, Payal, Bangles, Rings, Earrings | ${SITE_NAME}`;
  const desc = `Browse ${catalogs.length}+ collections of premium silver jewellery at ${SITE_NAME}. Silver juda, payal, kamarband, purse, bangles, necklace, earrings, rings. Wholesale pricing from Ahmedabad.`;
  const keywords = 'silver jewellery collections, wholesale catalogs, silver juda, silver payal, silver bangles, silver earrings, silver rings, silver necklace, silver purse, PM Jewellers, Ahmedabad, Gujarat';

  const cards = catalogs.map(c => {
    const img = imageUrl(c.heroImageUrl);
    return `<a href="/catalog/${c._id}" style="text-decoration:none;display:block;background:#FFFDF7;border:1px solid #E4D6B6;border-radius:20px;box-shadow:0 10px 30px rgba(30,24,16,0.07);padding:12px">
      <img src="${img}" alt="Silver ${esc(c.name)} collection gallery, PM Jewellers" style="width:100%;aspect-ratio:1;object-fit:cover;border-radius:14px" loading="lazy" width="400" height="400">
      <div style="padding:10px 4px 4px"><span style="font-family:'Cormorant Garamond',Georgia,serif;font-size:15px;font-weight:500;color:#1E1810">${esc(c.name)}</span></div>
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

  const body = `<div id="root"><div style="min-height:100vh;background:#F6F0E2;font-family:'Outfit','Helvetica Neue',Helvetica,Arial,sans-serif;color:#1E1810">
    <div style="background:#FCF9F1;padding:24px 20px;border-bottom:1px solid #E4D6B6;border-bottom-left-radius:22px;border-bottom-right-radius:22px">
      <p style="font-size:10px;font-weight:600;letter-spacing:3px;color:#8C6A24;margin:0 0 2px">Since 2005</p>
      <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:28px;font-weight:500;color:#1E1810;margin:0">Silver Jewellery Collections</h1>
    </div>
    <div style="padding:16px">
      <p style="font-size:11px;font-weight:600;letter-spacing:2px;color:#8C6A24;margin:0 0 14px">COLLECTIONS <span style="font-weight:600;color:#8C6A24">${catalogs.length}</span></p>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:12px">
          ${cards}
      </div>
    </div>
  </div></div>`;

  return injectHtml(baseHtml, head, body);
}

// ── Generate HTML for a simple static page (about / contact / privacy) ──
function staticPageHtml(baseHtml, { path: pagePath, title, description, h1, line }) {
  const canonical = `${SITE}${pagePath}`;
  const head = `<title>${esc(title)}</title>
    <meta name="description" content="${esc(description)}">
    <link rel="canonical" href="${canonical}">
    <meta property="og:type" content="website">
    <meta property="og:site_name" content="${SITE_NAME}">
    <meta property="og:title" content="${esc(title)}">
    <meta property="og:description" content="${esc(description)}">
    <meta property="og:image" content="${SITE}/logo.png">
    <meta property="og:url" content="${canonical}">
    <meta property="og:locale" content="en_IN">
    <meta name="twitter:card" content="summary_large_image">
    <meta name="twitter:title" content="${esc(title)}">
    <meta name="twitter:description" content="${esc(description)}">`;

  const body = `<div id="root"><div style="min-height:100vh;background:#F6F0E2;font-family:'Outfit','Helvetica Neue',Helvetica,Arial,sans-serif;color:#1E1810">
    <div style="background:#FCF9F1;padding:48px 20px 36px;border-bottom:1px solid #E4D6B6;border-bottom-left-radius:22px;border-bottom-right-radius:22px">
      <h1 style="font-family:'Cormorant Garamond',Georgia,serif;font-size:30px;font-weight:500;color:#1E1810;margin:0 0 10px">${esc(h1)}</h1>
      <p style="font-size:13px;font-weight:300;color:#5C5344;line-height:1.6;margin:0">${esc(line)}</p>
    </div>
  </div></div>`;

  return injectHtml(baseHtml, head, body);
}

const STATIC_PAGES = [
  { path: '/about', title: 'About PM Jewellers — Wholesale Silver Jewellery since 2005 | Manekchowk, Ahmedabad', description: 'PM Jewellers is a wholesale silver jewellery supplier in Manekchowk, Ahmedabad, since 2005. Silver juda, payal, kamarband, purse, bangles, necklace, earrings and rings.', h1: 'About PM Jewellers', line: 'Wholesale silver jewellery supplier since 2005, Manekchowk, Ahmedabad.' },
  { path: '/contact', title: 'Contact PM Jewellers — Wholesale Silver Jewellery, Manekchowk, Ahmedabad', description: 'Contact PM Jewellers, wholesale silver jewellery, Chandidham Complex, 1204/F2, MGH Road, Old City, Manekchowk, Ahmedabad 380001, Gujarat.', h1: 'Contact PM Jewellers', line: 'Chandidham Complex, 1204/F2, MGH Road, Old City, Manekchowk, Ahmedabad 380001, Gujarat.' },
  { path: '/privacy', title: 'Privacy Policy | PM Jewellers', description: 'Privacy policy for PM Jewellers, pmjewellers.com.', h1: 'Privacy Policy', line: 'Privacy policy for PM Jewellers.' },
];

async function main() {
  const t0 = Date.now();
  console.log('Pre-rendering all pages from API data...\n');

  const baseHtml = fs.readFileSync(path.join(DIST, 'index.html'), 'utf-8');
  if (!baseHtml.includes('<div id="root"></div>')) {
    console.error('dist/index.html is already pre-rendered (or not a fresh vite build). Run `vite build` first.');
    process.exit(1);
  }

  // --sample: only the 3 design sample URLs from the audit (first pass). Without it, all designs are generated.
  const sampleMode = process.argv.includes('--sample');
  const SAMPLE_DESIGN_IDS = new Set(['6a251d62a8d1c2b6f54f7228', '6a195c9c141aae1cc7fde206', '6a1944dcaa930cf3c735ef68']);

  let designCount = 0;
  let catalogCount = 0;

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

  fs.writeFileSync(path.join(DIST, 'index.html'), homeHtml(baseHtml, catalogs), 'utf-8');
  console.log('  ✓ Home page');

  for (const page of STATIC_PAGES) {
    const dir = path.join(DIST, page.path.slice(1));
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), staticPageHtml(baseHtml, page), 'utf-8');
    console.log(`  ✓ ${page.path}`);
  }

  const listingDir = path.join(DIST, 'listing');
  fs.mkdirSync(listingDir, { recursive: true });
  fs.writeFileSync(path.join(listingDir, 'index.html'), listingHtml(baseHtml, catalogs), 'utf-8');
  console.log('  ✓ Listing page');

  for (const cat of catalogs) {
    let designs = [];
    try {
      const res = await fetch(`${API}/public/designs?catalogId=${cat._id}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      designs = await res.json();
      if (!Array.isArray(designs)) throw new Error('designs response is not an array');
      designs = designs.filter(d => d.status === 'available');
    } catch (err) {
      console.error(`Failed to fetch designs for catalog ${cat._id} (${cat.name}): ${err.message}`);
      process.exit(1);
    }

    const catDir = path.join(DIST, 'catalog', cat._id);
    fs.mkdirSync(catDir, { recursive: true });
    fs.writeFileSync(path.join(catDir, 'index.html'), catalogHtml(baseHtml, cat, designs), 'utf-8');
    catalogCount++;

    for (const d of designs) {
      if (sampleMode && !SAMPLE_DESIGN_IDS.has(d._id)) continue;
      const designDir = path.join(DIST, 'design', d._id);
      fs.mkdirSync(designDir, { recursive: true });
      fs.writeFileSync(path.join(designDir, 'index.html'), designHtml(baseHtml, d, cat.name), 'utf-8');
      designCount++;
    }

    console.log(`  ✓ ${cat.name}: ${designs.length} designs`);
  }

  const elapsed = ((Date.now() - t0) / 1000).toFixed(1);
  console.log(`\nDone: Home + Listing + ${STATIC_PAGES.length} static + ${catalogCount} catalog + ${designCount} design pages in ${elapsed}s${sampleMode ? ' (--sample: only 3 design samples)' : ''}`);
}

main().catch(e => { console.error(e); process.exit(1); });
