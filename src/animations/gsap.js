// ============================================================
// GSAP setup + shared animation helpers
// ============================================================
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);
gsap.defaults({ ease: "power3.out", duration: 0.9 });

export { gsap, ScrollTrigger };

// Attach [data-reveal] observers to a root element.
// Uses a single ScrollTrigger batch to stay light.
export function attachReveals(root = document.body, onAdd) {
  const targets = Array.from(root.querySelectorAll("[data-reveal]"));
  if (!targets.length) return null;

  // Safety net: every element is visible by default (CSS no longer hides
  // [data-reveal]). The batch only runs a transient "from" animation —
  // if ScrollTrigger never fires, content simply stays readable.
  const batch = ScrollTrigger.batch(targets, {
    start: "top 92%",
    once: true,
    onEnter: (targets2) => {
      const els = Array.isArray(targets2) ? targets2 : [targets2];
      els.forEach((el) => el.classList.add("is-revealed"));
      gsap.fromTo(
        els,
        { autoAlpha: 0.001, y: 34 },
        { autoAlpha: 1, y: 0, duration: 0.95, stagger: 0.06, overwrite: "auto" }
      );
      // bring masked split-line headlines up when their container reveals
      els.forEach((el) => {
        el.querySelectorAll(".split-line > span").forEach((span) => {
          gsap.fromTo(span, { yPercent: 120 }, { yPercent: 0, duration: 1.05, overwrite: "auto" });
        });
      });
      if (onAdd) onAdd(els);
    },
  });

  return () => {
    try {
      batch.kill();
    } catch (_) {
      /* noop */
    }
    // If animations were killed mid-flight, guarantee nothing is left hidden.
    gsap.set(targets, { clearProps: "all" });
  };
}

// Re-trigger class-based reveals for elements already in DOM.
export function markReveal(node) {
  node.classList.add("is-revealed");
}

// Simple element reveal used by nav / small bits
export function fadeInEl(el, delay = 0) {
  if (!el) return;
  gsap.fromTo(
    el,
    { autoAlpha: 0, y: 24 },
    { autoAlpha: 1, y: 0, duration: 1, delay, ease: "power3.out" }
  );
}