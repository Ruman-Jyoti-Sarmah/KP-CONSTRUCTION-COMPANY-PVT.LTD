import { useEffect, useRef, useState } from "react";
import { ScrollTrigger } from "../animations/gsap.js";
import { process } from "../data/content.js";
import SectionTag from "../components/SectionTag.jsx";
import Artwork from "../components/Artwork.jsx";
import { prefersReducedMotion } from "../hooks/useMedia.js";

const ART = ["residence", "headquarters", "urban", "complex", "residence"];

export default function Process() {
  const listRef = useRef(null);
  const railRef = useRef(null);
  const [active, setActive] = useState(0);
  const activeRef = useRef(0);

  useEffect(() => {
    const list = listRef.current;
    if (!list || prefersReducedMotion()) return undefined;

    const apply = (p) => {
      if (railRef.current) railRef.current.style.transform = `scaleY(${Math.min(1, Math.max(0, p))})`;
      const idx = Math.min(process.length - 1, Math.floor(p * process.length));
      if (idx !== activeRef.current) {
        activeRef.current = idx;
        setActive(idx);
      }
    };

    const st = ScrollTrigger.create({
      trigger: list,
      start: "top 62%",
      end: "bottom 55%",
      scrub: true,
      onUpdate: (self) => apply(self.progress),
    });
    apply(0);
    return () => st.kill();
  }, []);

  return (
    <section id="process" className="relative bg-journey section-pad" aria-label="Process">
      <div className="container-x">
        <div className="flex flex-wrap items-end justify-between gap-8" data-reveal="">
          <div>
            <SectionTag>Process</SectionTag>
            <h2 className="h-d3 mt-7 max-w-xl text-charcoal">
              How we build,
              <br className="hidden sm:block" /> in five stages.
            </h2>
          </div>
          <p className="max-w-xs text-sm leading-relaxed text-charcoal/60">
            The line draws itself as each phase activates.
          </p>
        </div>

        <div className="mt-16 grid gap-x-14 gap-y-14 lg:grid-cols-12">
          {/* Stages + drawing line */}
          <div className="lg:col-span-7">
            <div className="relative" ref={listRef}>
              <span className="absolute bottom-2 left-5 top-2 w-px bg-charcoal/10" aria-hidden="true">
                <span
                  ref={railRef}
                  className="block h-full w-full origin-top bg-bronze"
                  style={{ transform: "scaleY(0)" }}
                />
              </span>

              <div className="flex flex-col">
                {process.map((st, i) => {
                  const on = active === i;
                  return (
                    <div
                      key={st.index}
                      className={`process-row relative border-b hairline-t py-7 pl-16 transition-opacity duration-500 ${on ? "opacity-100" : "opacity-[0.5]"}`}
                    >
                      <span
                        className={`absolute left-5 top-10 grid h-2.5 w-2.5 -translate-x-1/2 rounded-full transition-colors duration-300 ${on ? "bg-bronze" : "bg-charcoal/25"}`}
                        aria-hidden="true"
                      />
                      <span className={`process-index font-display text-4xl font-extrabold tracking-[-0.03em] text-charcoal/25`}>
                        {st.index}
                      </span>
                      <div className="process-copy">
                        <h3
                          className={`font-display text-2xl font-bold tracking-[-0.02em] transition-transform duration-500 sm:text-3xl ${on ? "translate-x-1.5 text-charcoal" : "text-charcoal/70"}`}
                        >
                          {st.title}
                        </h3>
                        <p
                          className={`mt-2 text-sm leading-relaxed transition-colors duration-500 ${on ? "text-charcoal/80" : "text-charcoal/55"}`}
                        >
                          {st.text}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Active stage preview */}
          <div className="lg:col-span-5 lg:sticky lg:top-28 lg:self-start">
            <div className="project-media relative aspect-[5/6] shadow-[var(--shadow-soft)]">
              <Artwork variant={ART[active]} className="preview-art" aspect="square" />
              <span className="absolute bottom-5 left-5 rounded-full bg-ivory/90 px-4 py-2 text-[0.66rem] uppercase tracking-[0.2em] text-charcoal/70">
                {process[active].index} — {process[active].title}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}