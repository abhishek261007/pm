export async function onRequest(context) {
  const { request, env, params } = context;
  const catalogId = params.id;

  // 1. Fetch the default index.html from the SPA
  const url = new URL(request.url);
  url.pathname = '/index.html';
  const response = await env.ASSETS.fetch(url);

  let imageUrl = null;
  let catalogName = 'PM Jewellers';
  
  // 2. Fetch catalog details from your API
  try {
    const apiRes = await fetch('https://apis.27012610.xyz/public/catalogs');
    if (apiRes.ok) {
      const catalogs = await apiRes.json();
      const catalog = catalogs.find(c => c._id === catalogId);
      
      if (catalog && catalog.heroImageUrl) {
        catalogName = catalog.name || catalogName;
        imageUrl = catalog.heroImageUrl.startsWith('http') 
          ? catalog.heroImageUrl 
          : `https://apis.27012610.xyz${catalog.heroImageUrl}`;
      }
    }
  } catch (err) {
    console.error('Failed to fetch catalog metadata for OG tags', err);
  }

  // 3. If we found a dynamic image, use HTMLRewriter to inject Open Graph tags
  if (imageUrl) {
    return new HTMLRewriter()
      .on('head', {
        element(e) {
          // Inject dynamic Open Graph tags
          e.append(`<meta property="og:title" content="${catalogName} | PM Jewellers" />`, { html: true });
          e.append(`<meta property="og:image" content="${imageUrl}" />`, { html: true });
          e.append(`<meta property="og:description" content="Browse our jewelry catalog." />`, { html: true });
          e.append(`<meta name="twitter:card" content="summary_large_image" />`, { html: true });
        }
      })
      .on('title', {
        element(e) {
          e.setInnerContent(`${catalogName} | PM Jewellers`);
        }
      })
      .transform(response);
  }

  // Fallback if no dynamic image was found
  return response;
}
