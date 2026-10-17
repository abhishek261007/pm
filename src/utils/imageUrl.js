const IMAGE_HOST = 'https://images.pmjewellers.com';

export function imageUrl(url) {
  if (!url) return url;
  if (url.startsWith('/')) return `${IMAGE_HOST}${url}`;
  return url.replace(/^https:\/\/(?:images|apis)\.27012610\.xyz(?=\/)/, IMAGE_HOST);
}
