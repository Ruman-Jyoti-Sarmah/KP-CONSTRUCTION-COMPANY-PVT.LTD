import { useState } from "react";
import { services, servicesCopy } from "../data/content.js";
import SectionTag from "../components/SectionTag.jsx";
import Img from "../components/Img.jsx";

const PHOTOS = {
  architecture: "/images/service-architecture.jpg",
  construction: "/images/service-construction.jpg",
  "civil engineering": "/images/service-civil.jpg",
  "structural engineering": "/images/service-structural.jpg",
  "project management": "/images/service-management.jpg",
  "interior & finishing": "/images/about.jpg",
};

export default function Services() {
  const [active, setActive] = useState(0);

  return (
    <section id="services" className="relative bg-journey section-pad" aria-label="Services">
      <div className="container-x">
        <div className="max-w-3xl" data-reveal="">
          <SectionTag>02 / What We Do</SectionTag>
          <h2 className="h-d2 mt-7 text-charcoal">
            Built on
            <br />
            expertise.
          </h2>
          <p className="lede mt-7 max-w-xl">
            Six disciplines, one accountable team. Hover or tap a service to see how each connects across a single
            delivery structure.
          </p>
        </div>

        <div className="mt-14 grid gap-x-14 gap-y-12 lg:grid-cols-12">
          {/* Interactive rows */}
          <div className="lg:col-span-7" onMouseLeave={() => setActive(0)}>
            <div className="flex flex-col">
              {services.map((s, i) => {
                const on = active === i;
                return (
                  <button
                    key={s.index}
                    type="button"
                    onClick={() => setActive(i)}
                    onMouseEnter={() => setActive(i)}
                    onFocus={() => setActive(i)}
                    aria-pressed={on}
                    aria-label={s.title}
                    data-reveal=""
                    className={`service-row w-full border-b hairline-t px-4 text-left transition-all duration-500 ${on ? "is-active py-8" : "py-6"} ${i === 0 ? "border-t" : ""}`}
                  >
                    <span className="flex items-center justify-between gap-6">
                      <span className="flex items-baseline gap-5">
                        <span className="service-num font-display text-base font-semibold">{s.index}</span>
                        <span
                          className={`font-display text-2xl font-bold tracking-[-0.02em] transition-colors duration-300 sm:text-3xl ${on ? "text-charcoal" : "text-charcoal/60"}`}
                        >
                          {s.title}
                        </span>
                      </span>
                      <span className="service-arrow" aria-hidden="true">
                        <svg viewBox="0 0 24 24" width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M5 12h13M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </span>
                    </span>
                    <span
                      className={`mt-3 block max-w-lg text-sm leading-relaxed transition-colors duration-500 ${on ? "text-charcoal/80" : "text-charcoal/60"}`}
                    >
                      {servicesCopy[s.index]}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sticky preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <div className="project-media relative aspect-[5/6] shadow-[var(--shadow-soft)]" data-reveal="">
              <Img
                key={active}
                src={PHOTOS[services[active].title.toLowerCase()] || PHOTOS.architecture}
                alt={`${services[active].title} — project photography`}
                fill
                zoom
                overlay="ov-ivory-bottom"
                grain
                fallbackVariant="headquarters"
              />
              <span className="absolute bottom-5 left-5 rounded-full bg-ivory/90 px-4 py-2 text-[0.66rem] uppercase tracking-[0.2em] text-charcoal/70">
                {services[active].index} — {services[active].title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
