import TabBar from '../components/TabBar';
import Hero from '../components/home/Hero';
import FeaturedReel from '../components/home/FeaturedReel';
import GalleryReel from '../components/home/GalleryReel';
import PdfCard from '../components/home/PdfCard';
import HallmarkBadge from '../components/home/HallmarkBadge';
import { FEATURED, GALLERY, PDFS } from '../data/reels';
import '../styles/home.css';

export default function Home() {
  return (
    <>
      <div className="home-root">
        <Hero />

        {/* ── FEATURED REELS ── */}
        <section className="section">
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
          <div className="featured-grid">
            {FEATURED.map(({ file }) => (
              <FeaturedReel key={file} src={file} />
            ))}
          </div>
        </section>

        {/* ── FULL REEL GALLERY ── */}
        <section className="section">
          <div className="section-head">
            <HallmarkBadge label="Watch" />
            <h2 className="section-heading">
              All <em>Reels</em>
            </h2>
          </div>
          <div className="gallery-scroll">
            {GALLERY.map((src) => (
              <GalleryReel key={src} src={src} />
            ))}
          </div>
        </section>

        {/* ── CATALOGUES ── */}
        <section className="section">
          <div className="section-head">
            <HallmarkBadge label="Browse" />
            <h2 className="section-heading">
              Design <em>Catalogues</em>
            </h2>
            <p className="section-desc">
              Detailed silver jewellery catalogues with weights, categories, and full specs.
            </p>
            <div className="section-rule" />
          </div>
          <div className="catalogue-grid">
            {PDFS.map((p) => (
              <PdfCard key={p.id} {...p} />
            ))}
          </div>
        </section>
      </div>
      <TabBar />
    </>
  );
}
