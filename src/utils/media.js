const BASE = '/reels/opt';
const VIDEO_BASE = '/reels';

export function videoUrl(src) {
  return `${VIDEO_BASE}/${encodeURIComponent(src)}`;
}

// Posters/covers are pre-generated at build time (ffmpeg frame grabs).
export function reelPosterUrl(src) {
  const stem = src.replace(/\.mp4$/i, '');
  return `${BASE}/${encodeURIComponent(stem)}.webp`;
}

export function pdfUrl(file) {
  return `${BASE}/${encodeURIComponent(file)}`;
}

export function pdfCoverUrl(file) {
  const stem = file.replace(/\.pdf$/i, '');
  return `${BASE}/${encodeURIComponent(stem)}.webp`;
}
