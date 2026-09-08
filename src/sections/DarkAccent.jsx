import { dark } from "../data/content.js";
import SectionTag from "../components/SectionTag.jsx";
import Img from "../components/Img.jsx";

/**
 * The single dark accent of the page — deep architectural green.
 * Provides contrast that makes the light sections feel more premium.
 */
export default function DarkAccent() {
  return (
    <section className="dark-section grain relative overflow-hidden section-pad" aria-label="Legacy">
      {/* dramatic architectural photograph */}
      <Img
        src="/images/dark.jpg"
        alt="Dramatic modern skyscraper architecture"
        fill
        eager
        fallbackVariant="headquarters"
        imgClassName="opacity-70"
      />
      <div
        className="pointer-events-none absolute inset-0"
        aria-hidden="true"
        style={{ background: "linear-gradient(180deg, rgba(60,45,20,0.55), rgba(24,18,10,0.92) 78%, #171208)" }}
      />

      <div className="container-x relative">
        <div className="grid gap-x-14 gap-y-12 lg:grid-cols-12">
          <div className="lg:col-span-7" data-reveal="">
            <SectionTag className="section-tag on-dark">{dark.eyebrow}</SectionTag>
            <h2 className="h-d2 mt-8" style={{ color: "#FFFFFF" }}>
              <span className="block overflow-hidden split-line"><span>{dark.titleTop}</span></span>
              <span className="block overflow-hidden split-line"><span>{dark.titleBottom}</span></span>
            </h2>
          </div>

          <div className="lg:col-span-5 lg:pt-24" data-reveal="">
            <p className="text-base leading-relaxed" style={{ color: "#FFFFFF" }}>{dark.body}</p>

            <div className="mt-10 flex items-center gap-5">
              <span className="h-12 w-px bg-white/25" aria-hidden="true" />
              <p className="text-[0.7rem] uppercase tracking-[0.22em]" style={{ color: "#FFFFFF" }}>{dark.statLabel}</p>
            </div>

            <div className="mt-12 flex flex-wrap gap-4">
              <a href="#projects" className="btn btn-solid" data-cursor-label="Explore">
                <span className="bl">Explore Projects</span>
                <span className="ba">→</span>
              </a>
            </div>
          </div>
        </div>

        {/* decorative measurement strip */}
        <div className="mt-20 hidden items-center justify-between border-t border-white/15 pt-6 lg:flex" aria-hidden="true">
          {["Design", "Engineering", "Construction", "Handover"].map((s, i) => (
            <span key={s} className="flex items-center gap-3 text-[0.66rem] uppercase tracking-[0.24em]" style={{ color: "#FFFFFF" }}>
              <span style={{ color: "#FFFFFF", opacity: 0.55 }}>{String(i + 1).padStart(2, "0")}</span> {s}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}