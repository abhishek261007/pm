// All editorial/content data lives here. Swapping a reel or adding a PDF
// is now a one-line change — no need to touch any component.

export const HERO_REEL = 'hero.mp4';

export const FEATURED = [
  { file: 'PM ORNA DEC REEL 2.mp4', caption: 'Evening Elegance' },
  { file: 'PM ORNA FEB REEL 1.mp4', caption: 'Festive Radiance' },
  { file: 'PM ORNA FEB REEL 3.mp4', caption: 'Modern Grace' },
];

export const GALLERY = [
  'PM ORNA FEB REEL 4.mp4',
  'PM ORNA FEB REEL 5.mp4',
  'PM ORNA FEB REEL 6.mp4',
  'PM ORNA FEB REEL 7.mp4',
  'PM ORNA FEB REEL 7.1.mp4',
];

export const CATEGORIES = ['Antique', 'Traditional', 'Contemporary', 'Festive', 'Bridal', 'Daily Wear'];

const WEIGHTS = [25, 40, 35, 50, 30, 45, 55, 28, 38, 42, 48, 32, 52, 36, 44, 60, 22, 58];

export const PDFS = Array.from({ length: 18 }, (_, i) => {
  const n = i + 1;
  return {
    id: n,
    file: n === 1 ? 'PM design1.pdf' : `pm design${n}.pdf`,
    label: `Design ${n}`,
    category: CATEGORIES[n % CATEGORIES.length],
    weight: WEIGHTS[n % WEIGHTS.length],
  };
});
