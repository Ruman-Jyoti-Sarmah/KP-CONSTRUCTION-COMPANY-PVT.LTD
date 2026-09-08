import { blueprintHeadline, blueprintNote } from "../data/content.js";
import SectionTag from "../components/SectionTag.jsx";
import Img from "../components/Img.jsx";

export default function Blueprint() {
  return (
    <section id="blueprint" className="relative bg-journey section-pad" aria-label="Blueprint precision">
      <div className="container-x">
        <div className="grid gap-x-14 gap-y-14 lg:grid-cols-12">
          {/* Headline */}
          <div className="lg:col-span-5" data-reveal="">
            <SectionTag>Drawing Discipline</SectionTag>
            <h2 className="h-d3 mt-7 text-charcoal">
              {blueprintHeadline.map((line) => (
                <span key={line} className="block overflow-hidden split-line"><span>{line}</span></span>
              ))}
            </h2>
            <p className="lede mt-8 max-w-sm text-sm">{blueprintNote}</p>

            <div className="mt-10 flex items-center gap-3">
              <span className="text-[0.62rem] uppercase tracking-[0.2em] text-charcoal/55">Section A — Typical</span>
              <span className="bp-dim" aria-hidden="true" />
              <span className="bp-label">12.400 m</span>
            </div>
          </div>

          {/* Technical sheet — photograph blended beneath the drawing */}
          <div className="lg:col-span-7" data-reveal="">
            <div className="bp-sheet relative overflow-hidden p-6 shadow-[var(--shadow-soft)] sm:p-10">
              <Img
                src="/images/blueprint.jpg"
                alt="Architectural plans and technical drawings"
                fill
                eager
                blend
                grain
                fallbackVariant="urban"
                imgClassName="opacity-30"
              />
              <span className="bp-grid-overlay" aria-hidden="true" />
              <span className="bp-label absolute right-6 top-6">KP — DWG 004 / DETAIL A</span>

              <div className="relative mt-8 aspect-[16/10] overflow-hidden">
                {/* dimension ticks + crosshairs */}
                <span className="bp-tick absolute left-[16%] top-[24%] rotate-90" />
                <span className="bp-tick absolute left-[42%] top-[62%]" />
                <span className="bp-tick absolute left-[68%] top-[32%] rotate-45" />
                <span className="bp-tick absolute left-[84%] top-[74%] rotate-90" />
                <span className="bp-xhair absolute left-[22%] top-[48%]" />
                <span className="bp-xhair absolute left-[76%] top-[18%]" />

                {/* animated construction lines */}
                <svg viewBox="0 0 100 62" preserveAspectRatio="none" className="absolute inset-0 h-full w-full" aria-hidden="true">
                  <g stroke="#e8e4da" strokeWidth="0.18" fill="none" opacity="0.65">
                    <path d="M6 54 L34 12 L74 12 L96 54 Z" />
                    <path d="M6 54 L96 54" />
                    <path d="M34 12 L34 54" strokeDasharray="1.4 1.4" className="bp-line" />
                    <path d="M74 12 L74 54" strokeDasharray="1.4 1.4" className="bp-line" />
                    <path d="M2 4 L98 4" strokeDasharray="0.9 1.6" />
                    <path d="M20 58 L20 60 M50 58 L50 60 M80 58 L80 60" />
                  </g>
                  <g stroke="#d9a84e" strokeWidth="0.3" fill="none">
                    <path d="M6 54 L34 12" style={{ strokeDasharray: 62, strokeDashoffset: 62, animation: "dash-draw 2.4s ease-out forwards" }} />
                    <path d="M34 12 L74 12" style={{ strokeDasharray: 46, strokeDashoffset: 46, animation: "dash-draw 2.4s ease-out .4s forwards" }} />
                    <path d="M74 12 L96 54" style={{ strokeDasharray: 56, strokeDashoffset: 56, animation: "dash-draw 2.4s ease-out .8s forwards" }} />
                  </g>
                </svg>

                {/* annotations */}
                <span className="bp-label absolute left-[6%] top-[6%]">+12.4</span>
                <span className="bp-label absolute right-[5%] top-[80%]">PLAN 04</span>
                <span className="bp-label absolute left-[40%] top-[70%]">Ø 600</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}