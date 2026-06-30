import { pdfCoverUrl } from '../../utils/media';

export default function PdfCard({ file, label }) {
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
    </a>
  );
}
