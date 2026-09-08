export default function SectionTag({ children, className = "" }) {
  return <span className={`section-tag ${className}`} aria-hidden="true">{children}</span>;
}