import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "../animations/gsap.js";
import { supportsWebGL, prefersReducedMotion } from "../hooks/useMedia.js";
import Artwork from "../components/Artwork.jsx";
import { intro, brand } from "../data/content.js";

/**
 * HERO — transparent overlay on the fixed 3D journey scene.
 * The 3D environment (tower approach) lives in JourneyScene; this
 * section only provides the readable HTML content. Desktop and
 * mobile reuse the same content with a portrait-first layout.
 */
export default function Hero() {
  const sectionRef = useRef(null);
  const cueRef = useRef(null);
  const isMobileViewport = typeof window !== "undefined" && window.innerWidth < 768;

  const [fallback, setFallback] = useState(false);
  useEffect(() => {
    setFallback(prefersReducedMotion() || !supportsWebGL());
  }, []);

  // Gentle fade of the scroll cue as the hero scrolls away.
  useEffect(() => {
    if (!sectionRef.current || fallback) return undefined;
    const st = ScrollTrigger.create({
      trigger: sectionRef.current,
      start: "top top",
      end: "60% top",
      scrub: true,
      onUpdate: (self) => {
        if (cueRef.current) cueRef.current.style.opacity = String(1 - Math.min(1, self.progress * 2.2));
      },
    });
    return () => st.kill();
  }, [fallback]);

  return (
    <section
      id="home"
      ref={sectionRef}
      className="relative flex min-h-[100svh] items-center overflow-hidden"
      aria-label="Introduction"
    >
      {/* Static architectural fallback when WebGL is unavailable */}
      {fallback && (
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-80">
          <Artwork variant="headquarters" className="max-h-[70vh] block w-auto" aspect="square" />
        </div>
      )}

      {/* Hero content — transparent so the 3D journey shows through */}
      <div
        className={`container-x relative z-10 w-full ${
          isMobileViewport ? "flex min-h-[100svh] flex-col justify-between py-24" : "py-28"
        }`}
      >
        {isMobileViewport ? <MobileHeroContent /> : <HeroContent />}
      </div>

      {/* scroll indicator */}
      <div
        ref={cueRef}
        className="absolute bottom-7 left-1/2 z-10 flex -translate-x-1/2 flex-col items-center gap-3"
      >
        <span className="text-[0.64rem] uppercase tracking-[0.3em] text-white/70">{intro.scrollCue}</span>
        <span className="relative block h-8 w-px bg-white/40">
          <span className="absolute h-2 w-px bg-bronze" style={{ animation: "cueDrop 1.4s ease-in-out infinite" }} />
        </span>
      </div>
    </section>
  );
}

/* Desktop hero content — plain markup, entrance animations start visible. */
function HeroContent() {
  return (
    <div className="hero-zone text-white">
      <p className="eyebrow">{intro.eyebrow}</p>
      <h1 className="h-d1 mt-5" style={{ color: "#C9962E" }} aria-label="We build what matters.">
        {intro.title.map((line, i) => (
          <span key={line} className="block overflow-hidden">
            <span
              style={{ animation: `fadeUp 1.1s cubic-bezier(.16,1,.3,1) ${0.1 + i * 0.12}s both` }}
              className="inline-block"
            >
              {line}
            </span>
          </span>
        ))}
      </h1>
      <p className="lede mt-6 max-w-xl">{intro.body}</p>

      <div className="mt-9 flex flex-wrap items-center gap-4">
        <a href={intro.secondaryHref} className="btn btn-solid" data-cursor-label="Start project">
          <span className="bl">{intro.secondary}</span>
          <span className="ba">→</span>
        </a>
        <a href={intro.primaryHref} className="btn btn-outline-light" data-cursor-label="Explore">
          <span className="bl">{intro.primary}</span>
          <span className="ba">→</span>
        </a>
      </div>

      <p className="mt-8 text-[0.66rem] uppercase tracking-[0.26em] text-white/60 lg:hidden">
        {intro.locationLabel}
      </p>
    </div>
  );
}

/**
 * MOBILE hero content — portrait-first typography layout.
 * Text safe areas top + bottom; the 3D tower occupies the middle.
 */
function MobileHeroContent() {
  const words = brand.tagline.split(" / ");
  return (
    <div className="hero-zone text-white">
      <div className="pt-2" style={{ animation: "fadeUp 1s cubic-bezier(.16,1,.3,1) .15s both" }}>
        <p className="eyebrow !text-[0.62rem]">{intro.eyebrow}</p>
        <div className="mt-4 space-y-1.5">
          {words.map((w, i) => (
            <p
              key={w}
              className="font-display text-[0.95rem] font-semibold uppercase tracking-[0.34em] text-white/85"
              style={{ animation: `fadeUp 0.9s cubic-bezier(.16,1,.3,1) ${0.22 + i * 0.12}s both` }}
            >
              <span className="mr-2 text-bronze">0{i + 1}</span>
              {w}
            </p>
          ))}
        </div>
        <span className="mt-5 block h-px w-16 bg-bronze/60" />
      </div>

      <div className="pb-2" style={{ animation: "fadeUp 1s cubic-bezier(.16,1,.3,1) .5s both" }}>
        <h1 className="h-d1 !text-[2.15rem] leading-[1.05]" style={{ color: "#C9962E" }} aria-label="We build what matters.">
          {intro.title.map((line, i) => (
            <span key={line} className="block overflow-hidden">
              <span
                style={{ animation: `fadeUp 1.1s cubic-bezier(.16,1,.3,1) ${0.55 + i * 0.12}s both` }}
                className="inline-block"
              >
                {line}
              </span>
            </span>
          ))}
        </h1>

        <div className="mt-6 flex flex-col items-stretch gap-3">
          <a href={intro.secondaryHref} className="btn btn-solid w-full !px-5 !py-3 !text-[0.72rem]" data-cursor-label="Start project">
            <span className="bl">{intro.secondary}</span>
            <span className="ba">→</span>
          </a>
          <a href={intro.primaryHref} className="btn btn-outline-light w-full !px-5 !py-3 !text-[0.72rem]" data-cursor-label="Explore">
            <span className="bl">{intro.primary}</span>
            <span className="ba">→</span>
          </a>
        </div>

        <p className="mt-5 text-[0.62rem] uppercase tracking-[0.26em] text-white/55">
          {intro.locationLabel}
        </p>
      </div>
    </div>
  );
}
