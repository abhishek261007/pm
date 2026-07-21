/**
 * prerender.mjs
 * ─────────────
 * Prerenders high-value pages (homepage, listing, catalog, about, contact, privacy)
 * so Googlebot sees real HTML on first crawl without executing JavaScript.
 *
 * Usage: node scripts/prerender.mjs
 * Must run AFTER `vite build` (expects dist/ to exist).
 */

import puppeteer from 'puppeteer';
import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const API = 'https://apis.27012610.xyz';
const DIST = path.resolve('dist');
const PORT = 4173;
const CONCURRENCY = 3;

// Static routes to always prerender
const STATIC_ROUTES = [
  '/',
  '/listing',
  '/about',
  '/contact',
  '/privacy',
];

function today() {
  return new Date().toISOString().split('T')[0];
}

/**
 * Simple static file server with SPA fallback (serves index.html for unknown paths).
 */
function createServer(distDir) {
  const MIME = {
    '.html': 'text/html',
    '.js': 'application/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.woff2': 'font/woff2',
    '.woff': 'font/woff',
    '.ttf': 'font/ttf',
    '.webp': 'image/webp',
    '.mp4': 'video/mp4',
    '.xml': 'application/xml',
    '.txt': 'text/plain',
  };

  return http.createServer((req, res) => {
    let filePath = path.join(distDir, req.url.split('?')[0]);

    // If it's a directory, look for index.html
    if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
      filePath = path.join(filePath, 'index.html');
    }

    // If file exists, serve it
    if (fs.existsSync(filePath)) {
      const ext = path.extname(filePath);
      res.writeHead(200, { 'Content-Type': MIME[ext] || 'application/octet-stream' });
      fs.createReadStream(filePath).pipe(res);
      return;
    }

    // SPA fallback — serve index.html
    const indexPath = path.join(distDir, 'index.html');
    res.writeHead(200, { 'Content-Type': 'text/html' });
    fs.createReadStream(indexPath).pipe(res);
  });
}

/**
 * Fetch catalog IDs from the API.
 */
async function getCatalogRoutes() {
  try {
    const res = await fetch(`${API}/public/catalogs`);
    const catalogs = await res.json();
    if (Array.isArray(catalogs)) {
      return catalogs.map((c) => `/catalog/${c._id}`);
    }
  } catch (e) {
    console.warn('  Could not fetch catalog list from API:', e.message);
  }
  return [];
}

/**
 * Prerender a single route and write the HTML to dist/.
 */
async function prerenderRoute(browser, route, distDir) {
  const page = await browser.newPage();
  try {
    await page.goto(`http://localhost:${PORT}${route}`, {
      waitUntil: 'networkidle2',
      timeout: 15000,
    });

    // Wait for React to hydrate
    await page.waitForSelector('#root > *', { timeout: 10000 });

    // Extra wait for dynamic content
    await new Promise((r) => setTimeout(r, 1000));

    const html = await page.content();

    // Write to dist/
    const outPath = path.join(distDir, route === '/' ? 'index.html' : `${route}/index.html`);
    const outDir = path.dirname(outPath);
    fs.mkdirSync(outDir, { recursive: true });
    fs.writeFileSync(outPath, html, 'utf-8');
    console.log(`  ✓ ${route}`);
  } catch (e) {
    console.warn(`  ✗ ${route}: ${e.message}`);
  } finally {
    await page.close();
  }
}

/**
 * Process items in batches with limited concurrency.
 */
async function processBatch(items, fn, concurrency) {
  for (let i = 0; i < items.length; i += concurrency) {
    const batch = items.slice(i, i + concurrency);
    await Promise.all(batch.map(fn));
  }
}

async function main() {
  console.log('Prerender: collecting routes...');

  // Build route list
  const catalogRoutes = await getCatalogRoutes();
  const routes = [...STATIC_ROUTES, ...catalogRoutes];
  console.log(`  ${STATIC_ROUTES.length} static + ${catalogRoutes.length} catalog = ${routes.length} total routes`);

  // Check if we can launch a browser (may not be available in CI/Cloudflare build)
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-gpu'],
    });
  } catch (e) {
    console.warn(`  Skipped: Cannot launch browser (${e.message}). Deploying SPA without prerender.`);
    return;
  }

  // Start local server
  const server = createServer(DIST);
  await new Promise((resolve) => server.listen(PORT, resolve));
  console.log(`  Server running on port ${PORT}`);

  // Prerender all routes
  console.log('Prerendering pages...');
  await processBatch(
    routes,
    (route) => prerenderRoute(browser, route, DIST),
    CONCURRENCY
  );

  // Cleanup
  await browser.close();
  server.close();
  console.log(`Done. ${routes.length} pages prerendered.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
