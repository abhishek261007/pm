const BADGES = [
  'Manekchowk Heritage',
  'Silver 925 Certified',
  'Wholesale Pricing',
  '100+ Design Catalogues',
  'Trusted Since 2005',
  'Handcrafted Excellence',
  'Pan-India Shipping',
  'Retail Partners Nationwide',
];

export default function TrustMarquee() {
  // Duplicate badges for seamless infinite scroll
  const track = [...BADGES, ...BADGES];

  return (
    <section className="marquee-section">
      <div className="marquee-wrap">
        <div className="marquee-track" aria-label="Trust badges">
          {track.map((text, i) => (
            <span key={i} className="marquee-badge" aria-hidden={i >= BADGES.length}>
              <span className="marquee-dot" aria-hidden="true">✦</span>
              {text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
