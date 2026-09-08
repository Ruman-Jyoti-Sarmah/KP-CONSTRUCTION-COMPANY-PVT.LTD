import { useRef, useCallback } from "react";

/**
 * Magnetic button/link wrapper. Gently pulls the element toward the cursor
 * (desktop, fine-pointer only) and springs back on leave.
 */
export default function MagneticButton({
  children,
  strength = 0.28,
  className = "",
  as: Tag = "button",
  ...props
}) {
  const ref = useRef(null);

  const onMove = useCallback(
    (e) => {
      const el = ref.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      el.style.transform = `translate(${dx * strength}px, ${dy * strength}px)`;
    },
    [strength]
  );

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (el) {
      el.style.transition = "transform 0.6s cubic-bezier(0.16,1,0.3,1)";
      el.style.transform = "translate(0,0)";
      setTimeout(() => {
        if (el && el.style) el.style.transition = "";
      }, 620);
    }
  }, []);

  return (
    <Tag
      ref={ref}
      className={`magnetic ${className}`}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      {...props}
    >
      {children}
    </Tag>
  );
}