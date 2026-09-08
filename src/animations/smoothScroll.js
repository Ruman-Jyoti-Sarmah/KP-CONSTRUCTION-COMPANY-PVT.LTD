// ============================================================
// Lenis smooth scroll + GSAP ScrollTrigger synchronization.
// Official drop-in from lenis docs.
// ============================================================
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { gsap, ScrollTrigger } from "./gsap.js";

let lenis = null;
let tickerFn = null;

export function initSmoothScroll() {
  if (lenis) return lenis;

  lenis = new Lenis({
    // premium, weighty but responsive feel
    duration: 1.15,
    durationMin: 0.5,
    touchMultiplier: 1.05,
    wheelMultiplier: 1,
    syncTouch: false,
    anchors: true,
    autoResize: true,
    respectReducedMotion: true,
  });

  // Keep GSAP's ScrollTrigger in lock-step with Lenis.
  lenis.on("scroll", ScrollTrigger.update);

  // Drive Lenis's raf from GSAP's ticker.
  tickerFn = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(tickerFn);
  gsap.ticker.lagSmoothing(0);

  // Ensure ScrollTrigger knows the real max scroll after content settles.
  window.addEventListener("resize", refresh);
  window.addEventListener("load", refresh);
  setTimeout(refresh, 1200);

  return lenis;
}

const refresh = () => ScrollTrigger.refresh();

export function getLenis() {
  return lenis;
}

export function destroySmoothScroll() {
  if (!lenis) return;
  if (tickerFn) gsap.ticker.remove(tickerFn);
  tickerFn = null;
  try {
    lenis.off("scroll", ScrollTrigger.update);
  } catch (_) {
    /* noop */
  }
  lenis.destroy();
  lenis = null;
}