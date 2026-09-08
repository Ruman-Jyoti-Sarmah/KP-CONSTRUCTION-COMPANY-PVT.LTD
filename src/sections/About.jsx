import { about } from "../data/content.js";
import SectionTag from "../components/SectionTag.jsx";
import AnimatedCounter from "../components/AnimatedCounter.jsx";
import Img from "../components/Img.jsx";

export default function About() {
  return (
    <section id="about" className="relative bg-journey section-pad" aria-label="About">
      <div className="container-x">
        <div className="grid items-start gap-x-14 gap-y-14 lg:grid-cols-12">
          {/* Left — large architectural image */}
          <div className="lg:col-span-6" data-reveal="">
            <Img
              src="/images/about.jpg"
              alt="Architectural interior with warm natural materials"
              ratio="aspect-[4/3] sm:aspect-[16/11]"
              parallax
              rounded
              overlay="ov-ivory-soft"
              grain
              fallbackVariant="urban"
              className="shadow-[var(--shadow-soft)]"
            />
            <p className="mt-5 text-[0.66rem] uppercase tracking-[0.22em] text-charcoal/45">
              Design and construction decisions belong in the same room.
            </p>
          </div>

          {/* Right — editorial typography */}
          <div className="lg:col-span-6 lg:pt-4">
            <div data-reveal="">
              <SectionTag>{about.eyebrow}</SectionTag>
              <h2 className="h-d2 mt-7 text-charcoal">
                {about.statement.map((line) => (
                  <span key={line} className="block overflow-hidden split-line"><span>{line}</span></span>
                ))}
              </h2>
              <p className="lede mt-8 max-w-xl">{about.description}</p>
              <p className="mt-6 max-w-xl text-sm leading-relaxed text-charcoal/65">
                We operate on a simple principle: design decisions and construction decisions belong in the same room.
                That is how detail survives the build.
              </p>
            </div>

            {/* Statistics — 2 x 2 grid */}
            <div className="mt-12 grid grid-cols-2 gap-x-8 gap-y-10 border-t hairline-t pt-10" data-reveal="">
              {about.stats.map((s) => (
                <div key={s.label}>
                  <div className="font-display text-5xl font-extrabold tracking-[-0.03em] text-charcoal sm:text-6xl">
                    <AnimatedCounter value={s.value} suffix={s.suffix} />
                  </div>
                  <p className="mt-2 text-[0.68rem] uppercase tracking-[0.2em] text-charcoal/60">{s.label}</p>
                </div>
              ))}
            </div>
            <p className="mt-6 text-[0.62rem] uppercase tracking-[0.16em] text-charcoal/40" data-reveal="">
              *Illustrative figures — edit in src/data/content.js
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
