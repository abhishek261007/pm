import TabBar from '../components/TabBar';
import Hero from '../components/home/Hero';
import FeaturedReel from '../components/home/FeaturedReel';
import ArcGallery from '../components/home/ArcGallery';
import GlassBall from '../components/home/GlassBall';
import HallmarkBadge from '../components/home/HallmarkBadge';
import ScrollReveal from '../components/home/ScrollReveal';
import TrustMarquee from '../components/home/TrustMarquee';
import LuxeFooter from '../components/home/LuxeFooter';
import SEO from '../components/SEO';
import { GALLERY, PDFS } from '../data/reels';
import { reelPosterUrl, pdfCoverUrl } from '../utils/media';
import { Link } from 'react-router-dom';
import '../styles/home.css';

export default function Home() {
  return (
    <>
      <SEO 
        title="Wholesale Silver Jewellery — Juda, Payal, Kamarband, Bangles, Rings"
        description="PM Jewellers is Ahmedabad's trusted wholesale silver jewellery supplier since 2005. Shop silver juda, silver payal, silver kamarband, silver purse, silver bangles, silver necklace, silver earrings, silver rings. 100+ design catalogues. Buy pure silver jewellery online."
        keywords="silver jewellery, silver juda, silver payal, silver kamarband, silver purse, silver bangles, silver necklace, silver earrings, silver rings, wholesale silver jewellery, antique silver jewellery, bridal silver jewellery, hallmarked silver, PM Jewellers, Ahmedabad, Gujarat, buy silver jewellery online"
        url="/"
        type="website"
        breadcrumbs={[
          { name: 'Home', url: '/' }
        ]}
      />
      <div className="home-root">
        <Hero />

        {/* ── ALL REELS ── */}
        <section className="section">
          <ScrollReveal>
            <div className="section-head">
              <HallmarkBadge label="Trending" />
              <h2 className="section-heading">
                Trending <em>Now</em>
              </h2>
              <div className="section-rule" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div style={{ height: 280, marginTop: 18 }}>
              <ArcGallery
                items={GALLERY.map((src) => ({
                  image: { src: reelPosterUrl(src), alt: src },
                }))}
                layout={{ itemWidth: 130, itemHeight: 231, spacing: 14, imageFit: 'cover' }}
                effects3D={{ arcDepth: 0.4, scaleDepth: 0.25, verticalDepth: 0.25, rotationDepth: 0.25 }}
                appearance={{ backgroundColor: 'transparent', edgeFadeWidth: 12, edgeFadeOpacity: 1, showShadow: true }}
                autoPlaySettings={{ autoPlay: true, autoPlaySpeed: 1.5, pauseOnHover: true }}
              />
            </div>
          </ScrollReveal>
        </section>

        {/* ── CATALOGUES ── */}
        <section className="section section--full">
          <ScrollReveal>
            <div className="section-head">
              <HallmarkBadge label="Browse" />
              <h2 className="section-heading">
                Design <em>Catalogues</em>
              </h2>
              <div className="section-rule" />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.15}>
            <div style={{ marginTop: 18, height: 420 }}>
              <GlassBall
                backgroundColor="transparent"
                images={PDFS.map((p) => pdfCoverUrl(p.file))}
                cardCount={16}
                coverage={0.92}
                cardScale={0.55}
                cardRatio={1}
                cardRadius={10}
                rotateSpeed={0.04}
                tilt={15}
              />
            </div>
          </ScrollReveal>
          <ScrollReveal delay={0.3}>
            <div className="section-cta-wrap">
              <Link to="/listing" className="section-cta">
                <span>View All Catalogues</span>
                <span className="section-cta-arrow">→</span>
              </Link>
            </div>
          </ScrollReveal>
        </section>

        {/* ── JEWELLERY SEARCH TERMS ── */}
        <section className="section" aria-labelledby="jewellery-tags-heading">
          <div className="section-head">
            <h2 id="jewellery-tags-heading" className="section-heading">
              Explore <em>Silver Jewellery</em>
            </h2>
            <p className="section-desc">
              Browse styles and collections from PM Jewellers.
            </p>
          </div>
          <nav aria-label="Silver jewellery topics" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 10, marginTop: 18 }}>
            {[
              'Antique Silver Juda', 'Bridal Silver Jewellery', 'Silver Payal',
              'Silver Kamarband', 'Silver Bangles', 'Silver Jhumka',
              'Traditional Silver Jewellery', 'Hallmarked Silver',
              'Wedding Jewellery', 'Handcrafted Silver Designs',
            ].map((topic) => (
              <Link
                key={topic}
                to="/listing"
                style={{ border: '1px solid #C9A227', borderRadius: 999, padding: '8px 14px', color: 'inherit', textDecoration: 'none', fontSize: 13 }}
              >
                #{topic.replaceAll(' ', '')}
              </Link>
            ))}
          </nav>
        </section>

        {/* ── TRUST MARQUEE ── */}
        <TrustMarquee />

        {/* ── FOOTER ── */}
        <LuxeFooter />
      </div>
      <TabBar />
    </>
  );
}
