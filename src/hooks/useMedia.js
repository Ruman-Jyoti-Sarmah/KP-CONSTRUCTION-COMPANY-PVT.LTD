import { useEffect, useState } from "react";

// ============================================================
// MEDIA / MOTION PREFERENCE HELPERS
// ============================================================

export const MOBILE_BREAKPOINT = 768;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function getCapabilities() {
  const w = typeof window !== "undefined" ? window : { innerWidth: 1280 };
  const width = w.innerWidth || 1280;
  const reduced = prefersReducedMotion();
  return {
    width,
    isMobile: width <= 767,
    isTablet: width >= 768 && width <= 1024,
    isReduced: reduced,
    // 3D quality tier
    tier: reduced || width <= 767 ? "low" : width <= 1024 ? "mid" : "high",
  };
}

// Toggle a class once a given amount of scroll has occurred.
export function onScrollClass(className, active = true) {
  const root = document.documentElement;
  const apply = () => {
    const y = window.scrollY ?? window.scrollTop ?? 0;
    root.classList.toggle(className, active ? y > 40 : y <= 40);
  };
  window.addEventListener("scroll", apply, { passive: true });
  apply();
  return () => window.removeEventListener("scroll", apply);
}

/**
 * Reusable responsive hook — returns true below the mobile breakpoint
 * (default 768px). Drives the desktop/mobile 3D scene switch so only
 * ONE Three.js scene is ever mounted (the other is unmounted and its
 * GPU resources are disposed by react-three-fiber).
 */
export function useIsMobile(breakpoint = MOBILE_BREAKPOINT) {
  const query = `(max-width: ${breakpoint - 0.02}px)`;
  const [isMobile, setIsMobile] = useState(() => {
    if (typeof window === "undefined" || !window.matchMedia) return false;
    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (!window.matchMedia) return undefined;
    const mq = window.matchMedia(query);
    const onChange = (e) => setIsMobile(e.matches);
    setIsMobile(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, [query]);

  return isMobile;
}

export function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(
      c.getContext("webgl2") ||
      c.getContext("webgl") ||
      window.WebGLRendererConfig ||
      (window.WebGLMath && true)
    );
  } catch (_) {
    return false;
  }
}