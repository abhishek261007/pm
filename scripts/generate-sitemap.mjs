const API = 'https://apis.27012610.xyz';
const SITE = 'https://pm.27012610.xyz';
const OUT = 'public/sitemap.xml';

async function main() {
  const pages = [
    { loc: '/', priority: 1.0, changefreq: 'daily' },
    { loc: '/listing', priority: 0.8, changefreq: 'daily' },
    { loc: '/wishlist', priority: 0.3, changefreq: 'weekly' },
    { loc: '/about', priority: 0.5, changefreq: 'monthly' },
  ];

  let urls = pages.map(p => ({
    loc: `${SITE}${p.loc}`,
    priority: p.priority,
    changefreq: p.changefreq,
  }));

  try {
    const catRes = await fetch(`${API}/public/catalogs`);
    const catalogs = await catRes.json();
    if (Array.isArray(catalogs)) {
      for (const cat of catalogs) {
        try {
          const dRes = await fetch(`${API}/public/designs?catalogId=${cat._id}`);
          const designs = await dRes.json();
          if (Array.isArray(designs)) {
            for (const d of designs) {
              urls.push({
                loc: `${SITE}/design/${d._id}?catalog=${cat._id}`,
                priority: 0.6,
                changefreq: 'weekly',
              });
            }
          }
        } catch { /* skip */ }
      }
    }
  } catch { /* no catalogs */ }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${urls.map(u => `  <url>
    <loc>${u.loc}</loc>
    <priority>${u.priority}</priority>
    <changefreq>${u.changefreq}</changefreq>
  </url>`).join('\n')}
</urlset>`;

  const fs = await import('fs');
  fs.writeFileSync(OUT, xml, 'utf-8');
  console.log(`Sitemap generated: ${urls.length} URLs → ${OUT}`);
}

main().catch(e => { console.error(e); process.exit(1); });
