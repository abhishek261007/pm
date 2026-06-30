import { pdfCoverUrl } from '../../utils/media';

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
      </div>
      <div className="catalogue-body">
        <span className="catalogue-title">{label}</span>
        <span className="catalogue-weight">{weight}g</span>
      </div>
    </a>
  );
}
