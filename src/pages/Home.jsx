import TabBar from '../components/TabBar';
import Hero from '../components/home/Hero';
import FeaturedReel from '../components/home/FeaturedReel';
import ArcGallery from '../components/home/ArcGallery';
import GlassBall from '../components/home/GlassBall';
import HallmarkBadge from '../components/home/HallmarkBadge';
import ScrollReveal from '../components/home/ScrollReveal';
import CategoryShowcase from '../components/home/CategoryShowcase';
import TrustMarquee from '../components/home/TrustMarquee';
import LuxeFooter from '../components/home/LuxeFooter';
import { FEATURED, GALLERY, PDFS } from '../data/reels';
import { reelPosterUrl, pdfCoverUrl } from '../utils/media';
import { Link } from 'react-router-dom';
import '../styles/home.css';

export default function Home() {
  return (
    <>
      <div className="home-root">
        <Hero />

        {/* ── FEATURED REELS ── */}
        <section className="section">
          <ScrollReveal>
            <div className="section-head">
              <HallmarkBadge label="Curated" />
              <h2 className="section-heading">
                Featured <em>Collections</em>
              </h2>
              <p className="section-desc">
                A handpicked selection of our finest silver and antique designs.
              </p>
              <div className="section-rule" />
            </div>
          </ScrollReveal>
          <div className="featured-grid">
            {FEATURED.map(({ file, caption }, i) => (
              <FeaturedReel key={file} src={file} caption={caption} index={i} />
            ))}
          </div>
        </section>

        {/* ── CATEGORY SHOWCASE ── */}
        <CategoryShowcase />

        {/* ── ALL REELS ── */}
        <section className="section">
          <ScrollReveal>
            <div className="section-head">
              <HallmarkBadge label="Gallery" />
              <h2 className="section-heading">
                Our <em>Reels</em>
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
                appearance={{ backgroundColor: '#0f1620', edgeFadeWidth: 12, edgeFadeOpacity: 1, showShadow: true }}
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

        {/* ── TRUST MARQUEE ── */}
        <TrustMarquee />

        {/* ── FOOTER ── */}
        <LuxeFooter />
      </div>
      <TabBar />
    </>
  );
}
