/**
 * generate-sitemap.mjs
 * ────────────────────
 * Builds a comprehensive, SEO-optimized sitemap with:
 *  - <lastmod> timestamps from API data
 *  - Proper <priority> hierarchy
 *  - <image:image> entries for design pages (Google Image Search)
 *  - Catalog listing pages as separate URLs
 *  - Sitemap index when > 5000 URLs (Google's recommended split)
 */

const API  = 'https://apis.27012610.xyz';
const SITE = 'https://pmjewellers.com';
const OUT  = 'public/sitemap.xml';
const OUT_INDEX = 'public/sitemap-index.xml';
const MAX_PER_SITEMAP = 5000; // Google recommends max 50,000, but smaller is faster to parse

function today() {
  return new Date().toISOString().split('T')[0]; // YYYY-MM-DD
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function urlEntry({ loc, priority, changefreq, lastmod, images }) {
  let xml = `  <url>\n    <loc>${escapeXml(loc)}</loc>\n`;
  if (lastmod)    xml += `    <lastmod>${lastmod}</lastmod>\n`;
  if (priority != null) xml += `    <priority>${priority}</priority>\n`;
  if (changefreq) xml += `    <changefreq>${changefreq}</changefreq>\n`;
  if (images && images.length) {
    for (const img of images) {
      xml += `    <image:image>\n`;
      xml += `      <image:loc>${escapeXml(img.loc)}</image:loc>\n`;
      if (img.title)   xml += `      <image:title>${escapeXml(img.title)}</image:title>\n`;
      if (img.caption) xml += `      <image:caption>${escapeXml(img.caption)}</image:caption>\n`;
      xml += `    </image:image>\n`;
    }
  }
  xml += `  </url>`;
  return xml;
}

function wrapUrlset(entries) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${entries.join('\n')}
</urlset>`;
}

function wrapSitemapIndex(sitemaps) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${sitemaps.map(s => `  <sitemap>
    <loc>${escapeXml(s.loc)}</loc>
    <lastmod>${s.lastmod}</lastmod>
  </sitemap>`).join('\n')}
</sitemapindex>`;
}

async function main() {
  const todayStr = today();

  // ── STATIC PAGES ──
  const urls = [
    {
      loc: `${SITE}/`,
      priority: 1.0,
      changefreq: 'daily',
      lastmod: todayStr,
    },
    {
      loc: `${SITE}/listing`,
      priority: 0.9,
      changefreq: 'daily',
      lastmod: todayStr,
    },
    {
      loc: `${SITE}/about`,
      priority: 0.6,
      changefreq: 'monthly',
      lastmod: todayStr,
    },
    {
      loc: `${SITE}/privacy`,
      priority: 0.3,
      changefreq: 'yearly',
      lastmod: todayStr,
    },
  ];
  // Note: /wishlist and /cart are user-specific, not useful for SEO

  // ── DYNAMIC PAGES: CATALOGS + DESIGNS ──
  try {
    const catRes = await fetch(`${API}/public/catalogs`);
    const catalogs = await catRes.json();

    if (Array.isArray(catalogs)) {
      for (const cat of catalogs) {
        // Catalog listing page
        urls.push({
          loc: `${SITE}/catalog/${cat._id}`,
          priority: 0.7,
          changefreq: 'weekly',
          lastmod: cat.updatedAt ? cat.updatedAt.split('T')[0] : todayStr,
        });

        // Individual design pages within this catalog
        try {
          const dRes = await fetch(`${API}/public/designs?catalogId=${cat._id}`);
          const designs = await dRes.json();

          if (Array.isArray(designs)) {
            for (const d of designs) {
              const designUrl = {
                loc: `${SITE}/design/${d._id}?catalog=${cat._id}`,
                priority: 0.6,
                changefreq: 'weekly',
                lastmod: d.updatedAt ? d.updatedAt.split('T')[0] : todayStr,
              };

              // Add image entries for Google Image Search indexing
              if (d.images && d.images.length) {
                designUrl.images = d.images.map((img, idx) => ({
                  loc: typeof img === 'string'
                    ? (img.startsWith('http') ? img : `${API}/uploads/${img}`)
                    : (img.url || img.src || ''),
                  title: d.name || d.title || `Silver Design ${d._id}`,
                  caption: d.category
                    ? `${d.category} silver jewellery by PM Jewellers, Ahmedabad`
                    : 'Wholesale silver jewellery design by PM Jewellers',
                })).filter(i => i.loc);
              }

              urls.push(designUrl);
            }
          }
        } catch { /* skip catalog designs on error */ }
      }
    }
  } catch { /* API unavailable — static pages only */ }

  // ── WRITE SITEMAP(S) ──
  const fs = await import('fs');

  if (urls.length <= MAX_PER_SITEMAP) {
    // Single sitemap
    const entries = urls.map(u => urlEntry(u));
    fs.writeFileSync(OUT, wrapUrlset(entries), 'utf-8');
    console.log(`Sitemap generated: ${urls.length} URLs → ${OUT}`);
  } else {
    // Split into multiple sitemaps + sitemap index
    const chunks = [];
    for (let i = 0; i < urls.length; i += MAX_PER_SITEMAP) {
      chunks.push(urls.slice(i, i + MAX_PER_SITEMAP));
    }

    const sitemapFiles = [];
    for (let idx = 0; idx < chunks.length; idx++) {
      const filename = idx === 0 ? 'sitemap.xml' : `sitemap-${idx + 1}.xml`;
      const filepath = `public/${filename}`;
      const entries = chunks[idx].map(u => urlEntry(u));
      fs.writeFileSync(filepath, wrapUrlset(entries), 'utf-8');
      sitemapFiles.push({
        loc: `${SITE}/${filename}`,
        lastmod: todayStr,
      });
      console.log(`  ${filename}: ${chunks[idx].length} URLs`);
    }

    fs.writeFileSync(OUT_INDEX, wrapSitemapIndex(sitemapFiles), 'utf-8');
    console.log(`Sitemap index generated: ${chunks.length} sitemaps, ${urls.length} total URLs`);
  }
}

main().catch(e => { console.error(e); process.exit(1); });
