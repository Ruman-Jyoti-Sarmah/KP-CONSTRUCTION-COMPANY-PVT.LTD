import { useEffect, useRef } from "react";
import { gsap } from "../animations/gsap.js";
import { materials } from "../data/content.js";
import SectionTag from "../components/SectionTag.jsx";
import Img from "../components/Img.jsx";
import { prefersReducedMotion } from "../hooks/useMedia.js";

const PHOTOS = {
  concrete: "/images/project-complex.jpg",
  steel: "/images/service-structural.jpg",
  glass: "/images/hero.jpg",
  stone: "/images/project-headquarters.jpg",
  wood: "/images/about.jpg",
};

const ALT = {
  concrete: "Board-formed concrete structure detail",
  steel: "Steel framework under construction",
  glass: "Glass curtain wall of a modern building",
  stone: "Stone and masonry facade detail",
  wood: "Warm timber architectural interior",
};

export default function Materials() {
  const sectionRef = useRef(null);
  const stripRef = useRef(null);

  useEffect(() => {
    if (!sectionRef.current || prefersReducedMotion()) return undefined;
    const tween = gsap.fromTo(
      stripRef.current,
      { y: 34 },
      { y: -34, ease: "none", scrollTrigger: { trigger: sectionRef.current, start: "top bottom", end: "bottom top", scrub: true } }
    );
    return () => tween.kill();
  }, []);

  return (
    <section id="materials" ref={sectionRef} className="relative bg-journey section-pad" aria-label="Materials">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8" data-reveal="">
          <div>
            <SectionTag>Craftsmanship</SectionTag>
            <h2 className="h-d3 mt-7 text-charcoal">Materials matter.</h2>
          </div>
          <p className="max-w-sm text-sm leading-relaxed text-charcoal/65">
            Every surface is chosen, tested and detailed to age with purpose and dignity.
          </p>
        </div>

        <div className="mt-16">
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-5" ref={stripRef}>
            {materials.map((m, i) => (
              <figure key={m} className="group material-tile relative overflow-hidden border hairline">
                <div className="aspect-[4/5]">
                  <Img
                    src={PHOTOS[m.toLowerCase()]}
                    alt={ALT[m.toLowerCase()] || m}
                    fill
                    zoom
                    overlay="ov-ivory-soft"
                    grain
                    fallbackVariant="residence"
                  />
                </div>
                <figcaption className="absolute inset-x-0 bottom-0 flex items-center justify-between border-t hairline-t bg-ivory/95 px-4 py-3">
                  <span className="font-display text-lg font-bold tracking-[-0.01em] text-charcoal">{m}</span>
                  <span className="text-[0.6rem] uppercase tracking-[0.2em] text-charcoal/45">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </figcaption>
              </figure>
            ))}
          </div>
          <p className="mt-9 text-[0.7rem] uppercase tracking-[0.2em] text-charcoal/50">
            Sampled in-situ — concrete, steel, glass, stone &amp; timber joinery.
          </p>
        </div>
      </div>
    </section>
  );
}