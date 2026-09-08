import { useEffect, useRef } from "react";
import { ScrollTrigger } from "../animations/gsap.js";

/**
 * Reveal-on-scroll wrapper. Fades/slides children in when entering viewport.
 * Honors prefers-reduced-motion via CSS.
 */
export default function Reveal({ as: Tag = "div", className = "", delay = 0, children, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    if (delay) el.style.transitionDelay = `${delay}s`;

    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) {
      el.classList.add("is-revealed");
      return undefined;
    }

    const st = ScrollTrigger.create({
      trigger: el,
      start: "top 88%",
      toggleActions: "play none none none",
      onEnter: () => el.classList.add("is-revealed"),
      once: true,
    });
    return () => st.kill();
  }, [delay]);

  return (
    <Tag ref={ref} data-reveal="" className={className} style={delay ? { transitionDelay: `${delay}s` } : undefined} {...props}>
      {children}
    </Tag>
  );
}