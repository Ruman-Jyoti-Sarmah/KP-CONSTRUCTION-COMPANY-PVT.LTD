import { useEffect, useRef } from "react";

/** Seamless horizontally looping marquee. Pauses on hover. Pure CSS. */
export default function Marquee({ items = [], duration = 34, className = "", size = "text-4xl" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return undefined;
    const inner = el.querySelector("[data-marquee-track]");
    if (inner) inner.style.animationDuration = `${duration}s`;
    return undefined;
  }, [duration]);

  return (
    <div className={`marquee ${className}`} ref={ref} aria-hidden="true">
      <div
        data-marquee-track
        className="flex gap-14 marquee-track"
        style={{ animationDuration: `${duration}s` }}
      >
        {[0, 1].map((copy) => (
          <div key={copy} className="flex shrink-0 gap-14">
            {items.map((m) => (
              <span key={m} className={`marquee-item ${size} whitespace-nowrap`}>
                {m} <span className="dot" aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}