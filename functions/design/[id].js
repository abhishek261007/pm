export async function onRequest(context) {
  const { request, env, params } = context;
  const designId = params.id;

  // 1. Fetch the default index.html from the SPA
  const url = new URL(request.url);
  url.pathname = '/index.html';
  const response = await env.ASSETS.fetch(url);

  let imageUrl = null;
  let title = 'PM Jewellers';
  
  // 2. Fetch design details from your API
  try {
    const apiRes = await fetch('https://apis.27012610.xyz/public/designs');
    if (apiRes.ok) {
      const designs = await apiRes.json();
      const design = designs.find(d => d._id === designId);
      
      if (design && design.imageUrl) {
        title = design.sku ? `Design ${design.sku} | PM Jewellers` : 'Design | PM Jewellers';
        imageUrl = design.imageUrl.startsWith('http') 
          ? design.imageUrl 
          : `https://apis.27012610.xyz${design.imageUrl}`;
      }
    }
  } catch (err) {
    console.error('Failed to fetch design metadata for OG tags', err);
  }

  // 3. If we found a dynamic image, use HTMLRewriter to inject Open Graph tags
  if (imageUrl) {
    return new HTMLRewriter()
      .on('meta[property="og:title"]', {
        element(e) { e.setAttribute('content', title); }
      })
      .on('meta[property="og:image"]', {
        element(e) { e.setAttribute('content', imageUrl); }
      })
      .on('meta[property="og:description"]', {
        element(e) { e.setAttribute('content', 'View this design from PM Jewellers.'); }
      })
      .on('title', {
        element(e) {
          e.setInnerContent(title);
        }
      })
      .transform(response);
  }

  return response;
}
