import { useEffect, useRef } from "react";
import { gsap } from "../animations/gsap.js";

/** Animated counting number revealed on scroll. */
export default function AnimatedCounter({ value = 0, suffix = "", duration = 1.6, className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;

    const obj = { n: 0 };
    const reduce =
      window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const st = gsap.to(obj, {
      n: value,
      duration: reduce ? 0.01 : duration,
      ease: "power2.out",
      scrollTrigger: {
        trigger: el,
        start: "top 88%",
        toggleActions: "play none none none",
        once: true,
      },
      onUpdate: () => {
        el.textContent = Math.round(obj.n).toString() + suffix;
      },
    });
    return () => st.scrollTrigger && st.scrollTrigger.kill();
  }, [value, suffix, duration]);

  return (
    <span ref={ref} className={className}>
      0{suffix}
    </span>
  );
}