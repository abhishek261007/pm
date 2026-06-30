import { pdfCoverUrl } from '../../utils/media';
import HallmarkBadge from './HallmarkBadge';

export default function PdfCard({ file, label, category, weight }) {
  return (
    <a
      href={pdfCoverUrl(file)}
      target="_blank"
      rel="noopener noreferrer"
      className="catalogue-card"
    >
      <div className="catalogue-thumb">
        <img className="catalogue-thumb-img" src={pdfCoverUrl(file)} alt={label} loading="lazy" />
        <span className="catalogue-thumb-shade" aria-hidden="true" />
        <HallmarkBadge label={category} size="xs" />
        <span className="catalogue-thumb-id">{label}</span>
      </div>
      <div className="catalogue-body">
        <span className="catalogue-title">{label}</span>
        <span className="catalogue-weight">{weight}g</span>
      </div>
    </a>
  );
}
