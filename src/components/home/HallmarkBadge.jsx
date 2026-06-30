// A small engraved-looking seal, styled after the purity stamps struck into
// silver jewellery. Used as section labels and as a corner mark on catalogue
// cards — the one recurring motif that ties the page back to the metal itself.

export default function HallmarkBadge({ label, size = 'sm' }) {
  return (
    <span className={`hallmark hallmark--${size}`}>
      <span className="hallmark-ring" aria-hidden="true" />
      <span className="hallmark-label">{label}</span>
    </span>
  );
}
