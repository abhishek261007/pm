import { Link } from 'react-router-dom';
import ScrollReveal from './ScrollReveal';

const PRODUCT_CATEGORIES = [
  {
    id: 'silver-jewellery',
    icon: '✦',
    title: 'Silver Jewellery',
    subtitle: 'Pure Silver · Sterling Silver · Hallmarked',
    keywords: [
      'Silver Jewellery', 'Silver Jewelry', 'Silver Ornaments', 'Sterling Silver Jewellery',
      'Pure Silver Jewellery', 'Silver Accessories', 'Silver Collection', 'Hallmarked Silver',
      'Traditional Silver Jewellery', 'Silver Jewellery Ahmedabad', 'Silver Jewellery Gujarat',
      'Silver Jewellery Shop', 'Silver Jewellery Store', 'Buy Silver Jewellery Online',
    ],
    description: 'Explore PM Jewellers\' exclusive range of pure silver jewellery, sterling silver ornaments, and hallmarked silver collections. As a trusted wholesale silver jewellery supplier in Ahmedabad since 2005, we offer 100+ catalogues of handcrafted silver accessories for retailers across India.',
    link: '/listing',
  },
  {
    id: 'silver-juda',
    icon: '❖',
    title: 'Silver Juda',
    subtitle: 'Antique Juda · Bridal Juda · Designer Juda',
    keywords: [
      'Silver Juda', 'Silver Juda Pin', 'Antique Silver Juda', 'Designer Juda',
      'Bridal Juda', 'Hair Juda', 'Silver Hair Accessories', 'Silver Bun Pin',
      'Silver Hair Pin', 'Juda for Wedding',
    ],
    description: 'Discover our stunning collection of silver juda pins, antique silver juda, and bridal hair accessories. Our handcrafted silver juda designs are perfect for weddings, festivals, and traditional occasions. Buy silver juda online from PM Jewellers, Manekchowk, Ahmedabad.',
    link: '/listing',
  },
  {
    id: 'silver-payal',
    icon: '✧',
    title: 'Silver Payal & Kamarband',
    subtitle: 'Anklets · Leg Chains · Traditional Payal',
    keywords: [
      'Silver Payal', 'Silver Anklet', 'Anklets for Women', 'Antique Payal',
      'Bridal Payal', 'Heavy Payal', 'Designer Payal', 'Oxidised Payal',
      'Traditional Payal', 'Silver Leg Chain', 'Silver Kamarband',
    ],
    description: 'Shop the finest silver payal, silver anklets, and kamarband collections from PM Jewellers. Our range includes antique payal, bridal payal, heavy designer payal, and oxidised payal for every occasion. Trusted wholesale supplier of silver anklets for women across Gujarat and India.',
    link: '/listing',
  },
  {
    id: 'silver-purse',
    icon: '◆',
    title: 'Silver Purse & Clutch',
    subtitle: 'Antique Purse · Bridal Purse · Designer Purse',
    keywords: [
      'Silver Purse', 'Silver Clutch', 'Antique Silver Purse', 'Bridal Purse',
      'Wedding Purse', 'Designer Purse', 'Handcrafted Purse', 'Ethnic Purse',
      'Party Purse', 'Silver Handbag',
    ],
    description: 'Elevate your collection with PM Jewellers\' handcrafted silver purses, antique silver clutches, and designer ethnic purses. From bridal purses to party handbags, our wholesale silver purse collection offers premium quality for retailers and boutiques.',
    link: '/listing',
  },
  {
    id: 'silver-bangles',
    icon: '♦',
    title: 'Silver Bangles & Bracelets',
    subtitle: 'Kada · Antique Bangles · Bridal Bangles',
    keywords: [
      'Silver Bangles', 'Silver Bracelet', 'Antique Bangles', 'Designer Bangles',
      'Kada', 'Silver Kada', 'Bridal Bangles', 'Traditional Bangles',
      'Handmade Bangles', 'Silver Wrist Jewellery',
    ],
    description: 'Browse our exquisite range of silver bangles, silver kada, and designer bracelets at PM Jewellers. From traditional bangles to bridal bangles and handmade wrist jewellery, we are the leading wholesale silver bangles supplier in Ahmedabad, Gujarat.',
    link: '/listing',
  },
  {
    id: 'silver-necklace',
    icon: '❖',
    title: 'Neck Jewellery',
    subtitle: 'Necklace · Pendant · Choker · Temple Jewellery',
    keywords: [
      'Silver Necklace', 'Silver Chain', 'Silver Pendant', 'Antique Necklace',
      'Bridal Necklace', 'Temple Jewellery', 'Traditional Necklace',
      'Designer Necklace', 'Silver Choker', 'Silver Set',
    ],
    description: 'PM Jewellers offers an extensive collection of silver necklaces, silver chains, pendants, chokers, and temple jewellery. Our wholesale silver neck jewellery range includes antique necklaces, bridal sets, and designer collections — perfect for retailers across India.',
    link: '/listing',
  },
  {
    id: 'silver-earrings',
    icon: '✧',
    title: 'Silver Earrings',
    subtitle: 'Jhumka · Studs · Hoops · Antique Earrings',
    keywords: [
      'Silver Earrings', 'Jhumka', 'Silver Jhumka', 'Antique Earrings',
      'Stud Earrings', 'Hoop Earrings', 'Designer Earrings', 'Bridal Earrings',
      'Oxidised Earrings', 'Handmade Earrings',
    ],
    description: 'Discover our handcrafted silver earrings collection — from silver jhumka and antique earrings to designer studs and hoops. PM Jewellers is your trusted wholesale supplier for silver earrings, oxidised earrings, and bridal earring sets in Ahmedabad.',
    link: '/listing',
  },
  {
    id: 'silver-rings',
    icon: '✦',
    title: 'Silver Rings',
    subtitle: 'Finger Rings · Adjustable Rings · Couple Rings',
    keywords: [
      'Silver Ring', 'Silver Finger Ring', 'Designer Ring', 'Antique Ring',
      'Adjustable Ring', 'Women\'s Ring', 'Men\'s Silver Ring', 'Couple Ring',
      'Sterling Silver Ring', 'Handmade Ring',
    ],
    description: 'Explore PM Jewellers\' range of silver rings, including designer finger rings, antique rings, adjustable rings, and couple rings. Our sterling silver rings and handmade rings are crafted with precision — ideal for wholesale buyers and retailers.',
    link: '/listing',
  },
];

const BUYING_INTENT_KEYWORDS = [
  'Buy Silver Jewellery Online', 'Silver Jewellery Store', 'Best Silver Jewellery',
  'Affordable Silver Jewellery', 'Premium Silver Jewellery', 'Handmade Silver Jewellery',
  'Wedding Jewellery', 'Bridal Jewellery', 'Traditional Jewellery', 'Designer Silver Jewellery',
  'Silver Jewellery Ahmedabad', 'Silver Jewellery Gujarat', 'Silver Jewellery Shop',
  'Jeweller Near Me', 'Silver Jewellery Store Near Me', 'PM Jewellers', 'PM Jewellers Silver',
  'Buy Silver Juda Online', 'Antique Silver Juda for Women', 'Handmade Silver Payal',
  'Bridal Silver Payal', 'Traditional Silver Purse', 'Silver Wedding Accessories',
  'Hallmarked Silver Jewellery', 'Premium Silver Ornaments', 'Silver Jewellery for Women',
  'Latest Silver Jewellery Designs', 'Silver Gifting Collection',
];

const LOCAL_KEYWORDS = [
  'Silver Jewellery Ahmedabad', 'Silver Jewellery Gujarat', 'Silver Jewellery Shop',
  'Jeweller Near Me', 'Silver Jewellery Store Near Me', 'Antique Jewellery Shop',
  'PM Jewellers', 'PM Jewellers Silver', 'PM Jewellers Collection',
  'Silver Jewellery Manekchowk', 'Wholesale Jeweller Ahmedabad',
];

export { PRODUCT_CATEGORIES, BUYING_INTENT_KEYWORDS, LOCAL_KEYWORDS };

export default function SEOContent() {
  return (
    <>
      {/* ── KEYWORD-RICH CATEGORY SECTIONS ── */}
      {PRODUCT_CATEGORIES.map((cat) => (
        <section key={cat.id} className="seo-section">
          <ScrollReveal>
            <div className="seo-card">
              <div className="seo-card-header">
                <span className="seo-card-icon" aria-hidden="true">{cat.icon}</span>
                <div>
                  <h2 className="seo-card-title">{cat.title}</h2>
                  <p className="seo-card-subtitle">{cat.subtitle}</p>
                </div>
              </div>
              <p className="seo-card-desc">{cat.description}</p>
              <div className="seo-card-keywords">
                {cat.keywords.slice(0, 8).map((kw) => (
                  <span key={kw} className="seo-tag">{kw}</span>
                ))}
              </div>
              <Link to={cat.link} className="seo-card-link">
                Explore {cat.title} Collection →
              </Link>
            </div>
          </ScrollReveal>
        </section>
      ))}

      {/* ── BUYING INTENT KEYWORDS SECTION ── */}
      <section className="seo-section">
        <ScrollReveal>
          <div className="seo-card seo-card--wide">
            <div className="seo-card-header">
              <span className="seo-card-icon" aria-hidden="true">◆</span>
              <div>
                <h2 className="seo-card-title">Why Choose PM Jewellers?</h2>
                <p className="seo-card-subtitle">Trusted Since 2005 · Manekchowk, Ahmedabad</p>
              </div>
            </div>
            <p className="seo-card-desc">
              PM Jewellers is Ahmedabad's premier wholesale silver jewellery supplier, offering 
              premium silver jewellery, antique ornaments, and handcrafted silver collections at 
              wholesale pricing. From bridal jewellery to traditional silver sets, our 100+ design 
              catalogues cater to retailers and wholesalers across India. Visit our store at 
              Manekchowk, Ahmedabad or browse our collection online.
            </p>
            <div className="seo-card-keywords">
              {BUYING_INTENT_KEYWORDS.slice(0, 12).map((kw) => (
                <span key={kw} className="seo-tag seo-tag--accent">{kw}</span>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── LOCAL SEO SECTION ── */}
      <section className="seo-section">
        <ScrollReveal>
          <div className="seo-card seo-card--local">
            <h3 className="seo-local-title">PM Jewellers — Silver Jewellery Shop in Ahmedabad, Gujarat</h3>
            <p className="seo-card-desc">
              Located in the heart of Manekchowk, Ahmedabad, PM Jewellers has been a trusted 
              name in silver jewellery since 2005. We are a leading silver jewellery store in 
              Gujarat, offering wholesale pricing on pure silver jewellery, antique ornaments, 
              and designer silver collections. Whether you're looking for a jeweller near me in 
              Ahmedabad or a reliable wholesale supplier across India, PM Jewellers delivers 
              quality, craftsmanship, and trust.
            </p>
            <div className="seo-card-keywords">
              {LOCAL_KEYWORDS.map((kw) => (
                <span key={kw} className="seo-tag">{kw}</span>
              ))}
            </div>
            <div className="seo-local-contact">
              <span>📞 +91 97127 79146</span>
              <span>📍 Manekchowk, Ahmedabad — 380001</span>
            </div>
          </div>
        </ScrollReveal>
      </section>

      {/* ── HIDDEN SEO CONTENT (for crawlers, visually hidden) ── */}
      <div className="sr-only" aria-hidden="false">
        <h2>PM Jewellers — Silver Jewellery Collection</h2>
        <p>
          PM Jewellers offers a comprehensive collection of silver jewellery including silver 
          juda, silver payal, silver kamarband, silver purses, silver bangles, silver necklaces, 
          silver earrings, and silver rings. Our wholesale silver jewellery collection features 
          antique silver jewellery, bridal silver jewellery, traditional Indian silver jewellery, 
          and designer silver ornaments. Buy silver jewellery online from PM Jewellers, 
          Manekchowk, Ahmedabad — trusted wholesale silver supplier since 2005.
        </p>
        <h3>Silver Juda Collection</h3>
        <p>
          Buy silver juda online at PM Jewellers. Our collection includes antique silver juda, 
          silver juda pin, designer juda, bridal juda, hair juda, silver hair accessories, 
          silver bun pin, and silver hair pin. Juda for wedding available in sterling silver 
          and pure silver options.
        </p>
        <h3>Silver Payal & Kamarband Collection</h3>
        <p>
          Explore our silver payal collection including silver anklets, anklets for women, 
          antique payal, bridal payal, heavy payal, designer payal, oxidised payal, traditional 
          payal, silver leg chain, and silver kamarband. Handcrafted in pure silver with 
          hallmarked quality.
        </p>
        <h3>Silver Purse & Clutch Collection</h3>
        <p>
          Shop silver purse, silver clutch, antique silver purse, bridal purse, wedding purse, 
          designer purse, handcrafted purse, ethnic purse, party purse, and silver handbag 
          from PM Jewellers. Premium quality wholesale silver purses for retailers.
        </p>
        <h3>Silver Bangles & Bracelets Collection</h3>
        <p>
          Browse silver bangles, silver bracelet, antique bangles, designer bangles, kada, 
          silver kada, bridal bangles, traditional bangles, handmade bangles, and silver 
          wrist jewellery at PM Jewellers. Leading wholesale silver bangles supplier.
        </p>
        <h3>Silver Necklace Collection</h3>
        <p>
          Discover silver necklace, silver chain, silver pendant, antique necklace, bridal 
          necklace, temple jewellery, traditional necklace, designer necklace, silver choker, 
          and silver set at PM Jewellers. Premium wholesale silver neck jewellery.
        </p>
        <h3>Silver Earrings Collection</h3>
        <p>
          Shop silver earrings, jhumka, silver jhumka, antique earrings, stud earrings, 
          hoop earrings, designer earrings, bridal earrings, oxidised earrings, and handmade 
          earrings from PM Jewellers. Trusted wholesale silver earrings supplier in Gujarat.
        </p>
        <h3>Silver Rings Collection</h3>
        <p>
          Explore silver ring, silver finger ring, designer ring, antique ring, adjustable 
          ring, women's ring, men's silver ring, couple ring, sterling silver ring, and 
          handmade ring at PM Jewellers. Premium wholesale silver rings for retailers.
        </p>
      </div>
    </>
  );
}
