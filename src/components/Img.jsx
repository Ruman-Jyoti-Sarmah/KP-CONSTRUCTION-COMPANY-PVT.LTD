import { useEffect, useRef, useState } from "react";
import { gsap } from "../animations/gsap.js";
import Artwork from "./Artwork.jsx";
import { prefersReducedMotion } from "../hooks/useMedia.js";

/**
 * Premium photographic image treatment.
 * - object-fit cover, crop-to-fill
 * - optional scroll parallax (desktop, motion-safe)
 * - cinematic overlay + film grain
 * - graceful fallback to the SVG architectural illustration if loading fails
 */
export default function Img({
  src,
  alt,
  className = "",
  fill = false,
  ratio = "aspect-[16/10]",
  eager = false,
  parallax = false,
  zoom = false,
  overlay = null,
  grain = false,
  blend = false,
  rounded = false,
  imgClassName = "",
  fallbackVariant = "residence",
  fallbackAspect = "wide",
}) {
  const wrapRef = useRef(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (!parallax || failed) return undefined;
    const el = wrapRef.current;
    if (!el) return undefined;
    const img = el.querySelector("img");
    if (!img || prefersReducedMotion()) return undefined;

    const tween = gsap.fromTo(
      img,
      { yPercent: -7 },
      {
        yPercent: 7,
        ease: "none",
        scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: true },
      }
    );
    return () => tween.kill();
  }, [parallax, failed]);

  return (
    <div
      ref={wrapRef}
      className={`overflow-hidden ${fill ? "absolute inset-0" : "relative"} ${fill ? "" : ratio} ${
        rounded ? "rounded-[var(--radius-card)]" : ""
      } ${className}`}
    >
      {failed ? (
        <Artwork variant={fallbackVariant} className="block h-full w-full" aspect={fallbackAspect} />
      ) : (
        <img
          src={src}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailed(true)}
          className={`img-cover ${parallax ? "img-parallax" : ""} ${zoom ? "img-zoom" : ""} ${
            blend ? "img-blend" : ""
          } ${imgClassName}`}
        />
      )}
      {overlay ? <span className={`img-overlay ${overlay}`} aria-hidden="true" /> : null}
      {grain ? <span className="img-grain" aria-hidden="true" /> : null}
    </div>
  );
}