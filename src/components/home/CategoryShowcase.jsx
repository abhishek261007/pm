import { Link } from 'react-router-dom';
import { CATEGORIES } from '../../data/reels';
import ScrollReveal from './ScrollReveal';
import HallmarkBadge from './HallmarkBadge';

const CATEGORY_ICONS = ['✦', '◆', '❖', '✧', '♦', '▣'];

export default function CategoryShowcase() {
  return (
    <section className="section">
      <ScrollReveal>
        <div className="section-head">
          <HallmarkBadge label="Explore" />
          <h2 className="section-heading">
            Shop by <em>Category</em>
          </h2>
          <div className="section-rule" />
        </div>
      </ScrollReveal>

      <div className="category-scroll">
        {CATEGORIES.map((cat, i) => (
          <ScrollReveal key={cat} delay={i * 0.08} direction="up">
            <Link
              to={`/listing?category=${encodeURIComponent(cat)}`}
              className="category-card"
            >
              <span className="category-icon">
                {CATEGORY_ICONS[i % CATEGORY_ICONS.length]}
              </span>
              <span className="category-name">{cat}</span>
              <span className="category-arrow">→</span>
            </Link>
          </ScrollReveal>
        ))}
      </div>
    </section>
  );
}
