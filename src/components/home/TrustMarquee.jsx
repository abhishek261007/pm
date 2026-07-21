const BADGES = [
  'Manekchowk Heritage',
  'Silver 925 Certified',
  'Hallmarked Silver',
  'Wholesale Pricing',
  '100+ Design Catalogues',
  'Handcrafted Excellence',
  'Pan-India Shipping',
  'Retail Partners Nationwide',
  'Antique Silver Jewellery',
  'Bridal Silver Collection',
  'Traditional Silver Designs',
  'Premium Silver Ornaments',
  'Buy Silver Jewellery Online',
  'Trusted Since 2005',
  'Ahmedabad Silver Wholesaler',
  'Gujarat Silver Supplier',
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
